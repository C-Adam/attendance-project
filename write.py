import RPi.GPIO as GPIO

from mfrc522 import MFRC522
from mfrc522 import SimpleMFRC522

reader = SimpleMFRC522()

text = input("New Data: ")
print("Place tag")

try:
    reader.write(text)
    tagId, writtenText = reader.read()
    print("Written:", writtenText)
finally:
    GPIO.cleanup()