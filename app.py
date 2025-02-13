import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BOARD)
from mfrc522 import SimpleMFRC522
import time
import sys

#RFID
reader = SimpleMFRC522()

#LEDs
GPIO.setup(33, GPIO.OUT)
GPIO.setup(37, GPIO.OUT)

def ToggleLED(led, state):
    if led == "red":
        if state == "on":
            GPIO.output(37, GPIO.HIGH) 
        elif state == "off":
            GPIO.output(37, GPIO.LOW)
    elif led == "blue":
        if state == "on":
            GPIO.output(33, GPIO.HIGH)
        elif state == "off":
            GPIO.output(33, GPIO.LOW)

try:
    while True:
        #Show program is ready by turning on blue LED
        ToggleLED("blue", "on") 
        time.sleep(1)

        #Attempt to read a card
        try:
            tagId, writtenText = reader.read() # Wait for a Tap
        except RuntimeError:
            #If reading fails, clean up the gpio and restart the script.
            print("Error Reading Card! Restarting System!")
            sys.exit()

        #After successful tap, turn the ready light off and wait light on.
        ToggleLED("blue", "off")   
        ToggleLED("red", "on")

        #Display data on card
        print(writtenText, flush=True)

        #Wait x seconds and restart code.
        time.sleep(1)
        ToggleLED("red", "off")
except KeyboardInterrupt:
    #Turn off LEDs when exiting the program (Ctrl + C).
    ToggleLED("blue", "off")
    ToggleLED("red", "off")
    print("Program Exited Safely")
finally:
    #Cleans the gpio pins for next use.
    GPIO.cleanup()

