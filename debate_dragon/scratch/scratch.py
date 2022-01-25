from PIL import Image, ImageFont, ImageDraw
# my_image = Image.open("dragon_drawing.png")
# title_font = ImageFont.truetype("ComicNeue-Regular.ttf", 90)
# title_text = "hello world"
# image_editable = ImageDraw.Draw(my_image)
# image_editable.text((15, 520), title_text, (0, 0, 0), font=title_font)
# my_image.save("result.png")

import textwrap

og_text = "hello gjlsjljf flsjf ldsajfljsfljdsaf lsajfls jfljflas"
print(og_text)
wrapped = textwrap.fill(og_text, width=10)
print(wrapped)
