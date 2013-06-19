echo "Uploading..."
scp server-slave.js stalker:/home/stalker/
scp server-slave.js pi:/home/pi/stalker/

echo "Restarting Node..."
ssh stalker "forever restartall"
ssh pi "forever restartall"

echo "Done"
