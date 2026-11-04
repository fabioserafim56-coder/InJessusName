"""HTTP/input contract tests. Model seams are explicit stubs, not inference tests."""
import base64
import io
from pathlib import Path
import sys
import unittest
from unittest.mock import patch

from fastapi.testclient import TestClient
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import app as service


def png_bytes():
    data = io.BytesIO()
    Image.new("RGB", (64, 48), "white").save(data, format="PNG")
    return data.getvalue()


class ServiceContract(unittest.TestCase):
    def setUp(self):
        self.environment = patch.dict("os.environ", {"INJESSUS_MULTIMODAL_SERVICE_TOKEN": "synthetic-test-token", "INJESSUS_VISION_ENABLED": "0", "INJESSUS_OCR_ENABLED": "1", "INJESSUS_VISION_PROVIDER": "qwen-local"})
        self.environment.start()
        self.client = TestClient(service.create_app())
        self.headers = {"Authorization": "Bearer synthetic-test-token"}

    def tearDown(self):
        self.client.close()
        self.environment.stop()

    def test_health_requires_token_and_does_not_load_models(self):
        self.assertEqual(self.client.get("/health").status_code, 401)
        response = self.client.get("/health", headers=self.headers)
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.json()["vision"]["enabled"])
        self.assertFalse(response.json()["vision"]["loaded"])
        self.assertFalse(response.json()["ocr"]["loaded"])
        self.assertNotIn("synthetic-test-token", response.text)

    def test_disabled_vision_does_not_attempt_loading(self):
        payload = {"imageBase64": base64.b64encode(png_bytes()).decode(), "mimeType": "image/png", "question": "O que vemos?", "context": {"title": "Peça de teste"}}
        with patch.object(service, "qwen_read") as model:
            response = self.client.post("/vision", headers=self.headers, json=payload)
        self.assertEqual(response.status_code, 503)
        model.assert_not_called()

    def test_ocr_rejects_non_image_and_oversized_input_before_inference(self):
        with patch.object(service, "paddle_read") as model:
            bad = self.client.post("/ocr", headers=self.headers, files={"image": ("x.svg", b"<svg/>", "image/svg+xml")})
            corrupt = self.client.post("/ocr", headers=self.headers, files={"image": ("x.png", b"not an image", "image/png")})
            large = self.client.post("/ocr", headers={**self.headers, "Content-Length": str(service.MAX_REQUEST_BYTES + 1)}, content=b"x")
        self.assertEqual(bad.status_code, 415)
        self.assertEqual(corrupt.status_code, 400)
        self.assertEqual(large.status_code, 413)
        model.assert_not_called()

    def test_ocr_transport_passes_pixels_to_explicit_model_seam(self):
        result = {"text": "João 3:16", "lines": [{"text": "João 3:16", "confidence": .99}], "provider": "paddleocr"}
        with patch.object(service, "paddle_read", return_value=result) as model:
            response = self.client.post("/ocr", headers=self.headers, files={"image": ("page.png", png_bytes(), "image/png")})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), result)
        self.assertEqual(model.call_args.args[0].size, (64, 48))
        self.assertEqual(model.call_args.args[0].mode, "RGB")

    def test_vision_rejects_url_and_bad_base64(self):
        with patch.dict("os.environ", {"INJESSUS_VISION_ENABLED": "1"}):
            bad = self.client.post("/vision", headers=self.headers, json={"imageBase64": "!!!!", "mimeType": "image/png", "question": "Observe", "context": {}})
            remote = self.client.post("/vision", headers=self.headers, json={"imageBase64": base64.b64encode(png_bytes()).decode(), "mimeType": "image/png", "question": "Observe", "context": {}, "imageUrl": "http://169.254.169.254/"})
        self.assertEqual(bad.status_code, 400)
        self.assertEqual(remote.status_code, 422)

    def test_vision_transport_preserves_question_and_documentation(self):
        payload = {"imageBase64": base64.b64encode(png_bytes()).decode(), "mimeType": "image/png", "question": "Qual é o contexto?", "context": {"title": "Peça de teste", "limits": ["Sem transcrição confirmada."]}}
        with patch.dict("os.environ", {"INJESSUS_VISION_ENABLED": "1"}):
            with patch.object(service, "qwen_read", return_value={"answer": "Resposta sintética de contrato.", "model": "contract-stub"}) as model:
                response = self.client.post("/vision", headers=self.headers, json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["model"], "contract-stub")
        self.assertEqual(model.call_args.args[1], payload["question"])
        self.assertEqual(model.call_args.args[2], payload["context"])


if __name__ == "__main__":
    unittest.main()
