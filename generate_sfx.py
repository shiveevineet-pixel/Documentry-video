import numpy as np
import wave
import struct
import math

SAMPLE_RATE = 44100

def write_wav(filename, samples):
    samples = np.clip(samples, -1.0, 1.0)
    int_samples = (samples * 32767).astype(np.int16)
    with wave.open(filename, 'w') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(SAMPLE_RATE)
        f.writeframes(int_samples.tobytes())
    print(f"Generated {filename}")

# 1. Radar Ping (1.2s)
t = np.linspace(0, 1.2, int(SAMPLE_RATE * 1.2), endpoint=False)
envelope = np.exp(-4.5 * t)
radar = (np.sin(2 * np.pi * 1250 * t) * 0.7 + np.sin(2 * np.pi * 2500 * t) * 0.3) * envelope
write_wav("public/audio/radar_ping.wav", radar)

# 2. Stamp Slam (0.7s sub impact + paper thud)
t = np.linspace(0, 0.7, int(SAMPLE_RATE * 0.7), endpoint=False)
sub = np.sin(2 * np.pi * (65 - 35 * t) * t) * np.exp(-12 * t)
noise = np.random.uniform(-1, 1, len(t)) * np.exp(-35 * t) * 0.5
stamp = sub * 0.8 + noise * 0.2
write_wav("public/audio/stamp_slam.wav", stamp)

# 3. Typewriter click (0.07s)
t = np.linspace(0, 0.07, int(SAMPLE_RATE * 0.07), endpoint=False)
click = np.sin(2 * np.pi * 3200 * t) * np.exp(-80 * t) + np.random.uniform(-1, 1, len(t)) * np.exp(-70 * t) * 0.6
write_wav("public/audio/typewriter_click.wav", click * 0.5)

# 4. FLIR Target Lock (0.25s tactical double pip)
t1 = np.linspace(0, 0.08, int(SAMPLE_RATE * 0.08), endpoint=False)
pip1 = np.sin(2 * np.pi * 1950 * t1) * np.exp(-20 * t1)
silence = np.zeros(int(SAMPLE_RATE * 0.04))
t2 = np.linspace(0, 0.12, int(SAMPLE_RATE * 0.12), endpoint=False)
pip2 = np.sin(2 * np.pi * 2400 * t2) * np.exp(-15 * t2)
flir = np.concatenate([pip1, silence, pip2])
write_wav("public/audio/flir_lock.wav", flir * 0.6)

# 5. Bass riser (2.5s)
t = np.linspace(0, 2.5, int(SAMPLE_RATE * 2.5), endpoint=False)
freq = 40 + 80 * (t / 2.5)**2
phase = 2 * np.pi * np.cumsum(freq) / SAMPLE_RATE
amp = (t / 2.5)**1.5
riser = np.sin(phase) * amp * 0.7
write_wav("public/audio/sub_riser.wav", riser)

# 6. Ambient Dark Drone (60.0s)
t = np.linspace(0, 60.0, int(SAMPLE_RATE * 60.0), endpoint=False)
sub_drone = (np.sin(2 * np.pi * 50 * t) * 0.4 +
             np.sin(2 * np.pi * 50.5 * t) * 0.3 +
             np.sin(2 * np.pi * 100 * t) * 0.15)
# Add slow modulation
mod = 0.85 + 0.15 * np.sin(2 * np.pi * 0.1 * t)
drone = sub_drone * mod * 0.4
write_wav("public/audio/ambient_drone.wav", drone)
