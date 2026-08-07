
![alt text](/images/s10server-demo.png)

Giving a second life to an old smartphone by turning it into a lightweight, portable Minecraft server.

If you’ve ever tried to snatch an `A1.flex` ARM instance on Oracle's Free Tier, you know the pain. It’s an incredible offering - up to 4 ARM cores and 24GB of RAM for free - but the servers are perpetually out of capacity. After checking daily for weeks and constantly hitting the "Out of host capacity" error, I got tired of waiting. I needed a performant, ARM-based hosting solution for my Minecraft server, and I didn't want to pay monthly fees for a simple server for friends.

That’s when I glanced at my drawer of old tech and saw my retired Samsung Galaxy S10+. Modern flagship smartphones pack incredibly powerful ARM processors and come with a built-in Uninterruptible Power Supply (UPS) - also known as a battery. Before migrating my setup to an old ThinkPad T480 I had lying around, I wanted to see just how viable Android-based server hosting could be. 

Here is the story of how I turned an old phone into a fully functional Minecraft PaperMC server.

## 1. Establishing a Secure Connection

Typing terminal commands on a touchscreen is a nightmare, so the first step was setting up remote access. I installed **Termux** via F-Droid, bringing a full Linux environment to the Android OS. 

From the phone, I installed the OpenSSH server and started the daemon on port 8022:
```bash
pkg update && pkg upgrade -y
pkg install openssh -y
sshd
```

To secure the connection and make logins seamless, I generated an `ed25519` SSH key on my Mac and securely copied it to the phone's Termux environment:
```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_s10_ed25519 -C "mac_to_s10"
ssh-copy-id -p 8022 -i ~/.ssh/id_s10_ed25519.pub u0_a916@10.x.x.x
```
With a quick `~/.ssh/config` update, I could now instantly drop into the phone's terminal from my Mac just by typing `ssh s10`.

## 2. Fetching the Server Software

Minecraft 1.21+ requires Java 21, but since I was using the bleeding-edge PaperMC builds, I opted for Java 25. 
```bash
pkg install openjdk-25 curl jq wget -y
```

PaperMC's old v2 downloads API was recently sunset, so I had to interact with their new v3 API. I wrote a quick bash script using `curl` and `jq` to dynamically fetch and download the absolute latest stable build of PaperMC directly to the phone:

```bash
USER_AGENT="mac-ssh-setup/1.0 (contact@example.com)"

LATEST_VERSION=$(curl -s -H "User-Agent: $USER_AGENT" \
  "https://fill.papermc.io/v3/projects/paper" | \
  jq -r '.versions | to_entries[0].value[0]')

DOWNLOAD_URL=$(curl -s -H "User-Agent: $USER_AGENT" \
  "https://fill.papermc.io/v3/projects/paper/versions/$LATEST_VERSION/builds" | \
  jq -r 'map(select(.channel == "STABLE")) | .[0].downloads["server:default"].url')

wget -O paper.jar "$DOWNLOAD_URL"
```

## 3. Migrating the Realms World and Fixing the Logo

I didn't want to start a new world from scratch; I needed to migrate my existing Minecraft Realms world over. After downloading the backup from Realms to my Mac and compressing it, I used `scp` to securely transfer the zip archive to the phone:
```bash
scp -P 8022 realms_world.zip u0_a916@10.x.x.x:~/minecraft-server/
```
Unzipping it via the terminal and cleaning up the default world generation took just a few seconds.

The last touch was adding a custom server icon. Minecraft is notoriously strict about the `server-icon.png` - it will silently reject it if it isn't exactly 64x64 pixels. Instead of messing around in an image editor, I utilized macOS's built-in Image Processing System (`sips`) from the terminal to perfectly format the image before transferring it:
```bash
sips -z 64 64 -s format png original_image.jpg --out server-icon.png
scp -P 8022 server-icon.png u0_a916@10.x.x.x:~/minecraft-server/
```

## 4. Booting it Up

With the EULA accepted (`echo "eula=true" > eula.txt`), I allocated 2GB of the phone's RAM to the Java Virtual Machine and fired up the server:
```bash
java -Xms1G -Xmx2G -jar paper.jar nogui
```

The server booted flawlessly. Chunk generation was surprisingly snappy thanks to the S10+'s Snapdragon processor, and the phone barely broke a sweat handling a few concurrent players.

## Conclusion

This project proved that old smartphone hardware is incredibly capable for lightweight server hosting. The Linux-on-Android ecosystem via Termux is robust enough to handle complex bash scripting, API requests, and JVM environments. 

While the S10+ handles the server admirably, my next step is migrating this entire setup over to my ThinkPad T480 to take advantage of the expanded RAM and active cooling. Since the server runs purely on Java, moving it will be as simple as zipping the directory and `scp`-ing it over to the laptop!
