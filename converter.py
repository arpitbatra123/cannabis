from PIL import Image
import shutil
import os

# To run first execute th following command: pip3 install Pillow

if __name__ == "__main__":
    if not os.path.exists("images-copy"):
        os.mkdir("./images-copy")

    for filename in os.listdir("./assets"):
        if filename.endswith(".jpg"):
            im = Image.open("./assets/" + filename).convert("RGB")
            im.save("./images-copy/" + filename.replace(".jpg", ".jpg"), "jpeg")
            print("Converted " + filename)
        else:
            shutil.copyfile("./assets/" + filename, "./images-copy/" + filename)
            print("Copying " + filename + " without converting")
