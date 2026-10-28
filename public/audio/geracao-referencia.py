import json, hashlib, os
from pathlib import Path
import numpy as np
import soundfile as sf
import onnxruntime as ort
from kokoro_onnx import Kokoro
root=Path(os.environ.get('INJESSUS_TTS_MODELS', '/tmp/injessus-kokoro-model'))
EXPECTED_SHA256 = {'model_quantized.onnx': 'fbae9257e1e05ffc727e951ef9b9c98418e6d79f1c9b6b13bd59f5c9028a1478', 'pm_alex.bin': '0175c753f59c54e7fd5a995bedef0c5ff2fb67e0043dd3dcb2ae74ec2acbeb2a', 'config.json': '5abb01e2403b072bf03d04fde160443e209d7a0dad49a423be15196b9b43c17f'}
for filename, expected in EXPECTED_SHA256.items():
    if hashlib.sha256((root/filename).read_bytes()).hexdigest() != expected:
        raise RuntimeError("Arquivo de geração não corresponde à fonte fixada: "+filename)
ort.disable_telemetry_events()
voice=np.fromfile(root/'pm_alex.bin',dtype=np.float32).reshape(-1,1,256)
np.savez(root/'voices.npz',pm_alex=voice)
options=ort.SessionOptions();options.intra_op_num_threads=2;options.inter_op_num_threads=1
session=ort.InferenceSession(str(root/'model_quantized.onnx'),sess_options=options,providers=['CPUExecutionProvider'])
k=Kokoro.from_session(session,str(root/'voices.npz'),vocab_config=str(root/'config.json'))
parts=[
'Que bom ter você aqui. Vamos abrir a Palavra juntos.',
'Você pode chegar com sua fé, suas perguntas e o que ainda não compreende.',
'Não precisamos correr. Leia uma passagem, escute com atenção e guarde um ensinamento para levar à vida.',
'Se desejar, faça uma oração com suas próprias palavras.',
'Que este tempo nos ajude a conhecer melhor as Escrituras e a cuidar uns dos outros.'
]
audios=[]
for i,text in enumerate(parts):
 print('Generating',i+1,flush=True)
 samples,rate=k.create(text,voice='pm_alex',lang='pt-br',speed=.91)
 audios += [samples,np.zeros(int(rate*.42),dtype=np.float32)]
audio=np.concatenate(audios);audio=audio/max(1.,float(np.max(np.abs(audio)))/.94)
out=Path(__file__).resolve().parent/'bem-vindo-kokoro-ptbr.wav'
sf.write(out,audio,rate,subtype='PCM_16')
print(json.dumps({'duration':len(audio)/rate,'rate':rate,'peak':float(np.max(np.abs(audio))),'text':' '.join(parts),'wav_sha256':hashlib.sha256(out.read_bytes()).hexdigest()},ensure_ascii=False),flush=True)
