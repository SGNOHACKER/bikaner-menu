import qrcode

# URL of the website
url = "file:///D:/Websites/website%20for%20restaurants/Bikaner%20elite%20patna%20saguna%20more/index.html"

# Generate QR code
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)
qr.add_data(url)
qr.make(fit=True)

# Create an image from the QR Code instance
img = qr.make_image(fill_color="black", back_color="white")

# Save the image
img.save("bikaner_elite_qr.png")

print("QR code generated and saved as bikaner_elite_qr.png")