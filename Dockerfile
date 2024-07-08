# Utilisation de l'image de base avec PyTorch 2.3.1
FROM pytorch/pytorch:2.3.1-cuda11.8-cudnn8-devel

# Installer Node.js et autres dépendances
RUN apt-get update && \
    apt-get install -y curl build-essential libssl-dev libffi-dev libmysqlclient-dev pkg-config && \
    curl -fsSL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Répertoire de travail dans le conteneur
WORKDIR /app

# Copier et installer les dépendances Node.js
COPY package.json package-lock.json ./
RUN npm install --production

# Copier et installer les dépendances Python
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copier le reste du code source
COPY . .

# Exposer le port sur lequel l'application va tourner (si nécessaire)
EXPOSE 3000

# Commande par défaut à exécuter lorsque le conteneur démarre
CMD ["npm", "start"]