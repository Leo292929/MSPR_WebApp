import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import sys
import os
import mysql.connector
from PIL.ExifTags import TAGS, GPSTAGS
from datetime import datetime

def process_file(file_path):

    classes = { 0:  "Castor",
                1:  "Chat",
                2:  "Chien",
                3:  "Coyote",
                4:  "Ecureuil",
                5:  "Lapin",
                6:  "Loup",
                7:  "Lynx",
                8:  "Ours",
                9:  "Puma",
                10: "Rat",
                11: "Raton Laveur",
                12: "Renard"
              }


    modele_path = "modeleState.pt"
    modele_resnet = models.resnet50()
    num_classes = 13
    modele_resnet.fc = torch.nn.Linear(modele_resnet.fc.in_features, num_classes)
    modele_resnet.load_state_dict(torch.load(modele_path, map_location=torch.device('cpu')))
    modele_resnet.eval()

    transformations = transforms.Compose([
        transforms.Resize((256, 256)),  # Redimensionner l'image
        transforms.ToTensor(),  # Convertir en tenseur
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])  # Normaliser
    ])

    image = Image.open(file_path).convert('RGB')  # Charger l'image et convertir en RGB
    image_transform = transformations(image).unsqueeze(0)

    with torch.no_grad():
        prediction = modele_resnet(image_transform)

    probabilities = torch.nn.functional.softmax(prediction[0], dim=0)
    top_prob, top_class = torch.topk(probabilities, k=3)

    resultat1 = classes[top_class[0].item()]
    resultat2 = classes[top_class[1].item()]
    resultat3 = classes[top_class[2].item()]

    probresultat1 = round(top_prob[0].item(), 2)
    probresultat2 = round(top_prob[1].item(), 2)
    probresultat3 = round(top_prob[2].item(), 2)

    result = f"le resultat le plus probable est {resultat1} ({probresultat1}%) ensuite {resultat2} ({probresultat2}%) et puis {resultat3} ({probresultat3}%). "


    
    return result,top_class[0].item()




def get_exif_data(image_path,typeData):
    image = Image.open(image_path)
    exif_data = image._getexif()
    if exif_data is not None:
        for tag, value in exif_data.items():
            tag_name = TAGS.get(tag, tag)
            if tag_name == typeData:
                return value




def insertIn2Db(path,result,idUser=1):
    try:
        gpsInfo = get_exif_data(path,'GPSInfo')
        gpsInfo = str(gpsInfo)
    except:
        gpsInfo = ""
        print("pas d'info gps")
    try:
        dateTime = get_exif_data(path,'DateTime')
        format_string = '%Y:%m:%d %H:%M:%S'
        dateTime = datetime.strptime(dateTime, format_string)
        date = dateTime.date()
        heure = dateTime.time()
    except:
        date = datetime.now().date()
        heure = datetime.now().time()
        print("pas d'info datetime")



    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="MSPR61"
    )
    mycursor = mydb.cursor()

    sql = "INSERT INTO Empreinte (idUser,idEspece,adresseImage,datePhoto,heurePhoto,localisationempreinte) VALUES (%s, %s, %s, %s, %s, %s)"
    val = (idUser, result,path,date,heure,gpsInfo)

    mycursor.execute(sql, val)

    mydb.commit()

    print(mycursor.rowcount, "enregistrement inséré.")

    mydb.close()






if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Erreur : chemin du fichier non fourni.")
        sys.exit(1)
    file_path = sys.argv[1]
    result,resultat1 = process_file(file_path)
    insertIn2Db(file_path,resultat1)
    print(result)