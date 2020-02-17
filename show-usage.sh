echo -n "           "
ps aux | head -1 | cut -c 17-42
while true; do
    echo "$(date +%H:%M:%S) | $(ps aux | grep v10.16.3 | grep jwt | cut -c 17-42) jwt"
    echo "         | $(ps aux | grep v10.16.3 | grep api | cut -c 17-42) api"
    echo "         | $(ps aux | grep v10.16.3 | grep vert | cut -c 17-42) vertial"
    for x in 1 2 3 4 5 6 7 8 9 0;do
        sleep 1
        echo -n .
    done
    echo
done
