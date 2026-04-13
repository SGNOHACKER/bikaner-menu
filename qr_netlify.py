import qrcode

# URL of the website
url = "https://bikaner-menu.netlify.app/"

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
img.save("bikaner_menu_qr.png")

print("QR code generated and saved as bikaner_menu_qr.png")