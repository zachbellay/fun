from PIL import Image, ImageChops
import imutils
import numpy as np
import cv2
import click


texture_size = (512, 512)


def human_format(num):
    magnitude = 0
    while abs(num) >= 1000:
        magnitude += 1
        num /= 1000.0
    # add more suffixes if you need them
    output = "%.2f%s" % (num, ["", "K", "M", "B", "T", "Q"][magnitude])
    output = output.replace(".", "_")
    return output

def trim(im):
    im_mask = Image.fromarray(np.ma.where(im >= 0, 255, 0).astype(np.uint8))
    im = Image.fromarray(im.astype(np.uint8))
    bbox = im_mask.getbbox()
    return np.asarray(im.crop(bbox))


@click.command()
@click.argument("value", type=click.INT)
@click.option(
    "--imgs", default="./imgs", help="Path to images used to generate textures"
)
@click.option(
    "--output",
    default="../public/",
)
def generate_texture(value, imgs, output):

    print(f"Generating texture for {value}")

    bundles = value / 10000

    # length, height, depth of a $10,000
    # bundle in $100's in millimeters
    length = 156
    height = 66
    depth = 10

    alpha = np.cbrt(bundles * length * height * depth)

    # number of bundles lengthwise, heightwise, and depthwise
    upper_limit = 341
    l = min(round(alpha / length), upper_limit)
    h = min(round(alpha / height), upper_limit)
    d = min(round(alpha / depth), upper_limit)

    if l == upper_limit and h == upper_limit and d == upper_limit:
        print("UPPER LIMIT REACHED!")

    front = np.asarray(Image.open(f"{imgs}/front.jpg"))
    back = np.asarray(Image.open(f"{imgs}/back.jpg"))
    side = np.asarray(Image.open(f"{imgs}/side.jpg"))

    # generate texture for front
    front_bills_x = max(int(texture_size[0] / l), 1)
    front_bills_y = max(int(texture_size[0] / h), 1)
    front_scaled = cv2.resize(front, (max(front_bills_x, 1), max(front_bills_y, 1)))

    front_layer = np.dstack([np.full(texture_size, -1) for _ in range(3)])

    for i in range(l):
        for j in range(h):
            front_layer[
                j * front_bills_y : (j + 1) * front_bills_y,
                i * front_bills_x : (i + 1) * front_bills_x,
                :,
            ] = front_scaled

    front_layer = trim(front_layer)
    front_layer = cv2.resize(front_layer, texture_size)

    # generate texture for back

    back_bills_x = max(int(texture_size[0] / l), 1)
    back_bills_y = max(int(texture_size[0] / h), 1)
    back_scaled = cv2.resize(back, (back_bills_x, back_bills_y))

    back_layer = np.dstack([np.full(texture_size, -1) for _ in range(3)])

    for i in range(l):
        for j in range(h):
            back_layer[
                j * back_bills_y : (j + 1) * back_bills_y,
                i * back_bills_x : (i + 1) * back_bills_x,
                :,
            ] = back_scaled

    back_layer = trim(back_layer)
    back_layer = cv2.resize(back_layer, texture_size)

    # generate texture for side

    side_bills_x = max(int(texture_size[0] / d), 1)
    side_bills_y = max(int(2048 / h), 1)
    side_scaled = cv2.resize(side, (side_bills_x, side_bills_y))

    side_layer = np.dstack([np.full((2048, texture_size[0]), -1) for _ in range(3)])

    for i in range(d):
        for j in range(h):
            side_layer[
                j * side_bills_y : (j + 1) * side_bills_y,
                i * side_bills_x : (i + 1) * side_bills_x,
                :,
            ] = side_scaled

    side_layer = trim(side_layer)
    side_layer = cv2.resize(side_layer, texture_size)

    Image.fromarray(front_layer.astype(np.uint8)).save(
        f"{output}/{human_format(value)}_front.jpg"
    )
    print(f"Image saved to {output}/{human_format(value)}_front.jpg")

    Image.fromarray(back_layer.astype(np.uint8)).save(
        f"{output}/{human_format(value)}_back.jpg"
    )
    print(f"Image saved to {output}/{human_format(value)}_back.jpg")

    Image.fromarray(side_layer.astype(np.uint8)).save(
        f"{output}/{human_format(value)}_side.jpg"
    )
    print(f"Image saved to {output}/{human_format(value)}_side.jpg")


if __name__ == "__main__":
    generate_texture()
