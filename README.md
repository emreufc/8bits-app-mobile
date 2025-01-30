
# 8bites

Bu uygulama 7 kişiden oluşan İTÜ Bilgisayar Mühendisliği öğrencilerinin Software Engineering Projesi uygulamasıdır. Bu proje, kullanıcıya özel yemek tarifleri öneren, alışveriş sepeti ve envanter saklama gibi özellikleri bulunan, yapılan tariflerin malzemelerini mutfaktaki malzemelerden düşen ve kullanıcın sahip olduğu malzemelere göre kullanıcıya yemek önerisinde bulunan bir mobil uygulamadır. Uygulamanın arayüz akışı ve backend isteklerinin detaylıca anlatıldığı demo videosuna linkten ulaşabilirsiniz : https://drive.google.com/file/d/1t82_sSYkLF6yDWvukfuv3dIUyxev8I20/view?usp=sharing

## Başlarken

Bu proje için aşağıdaki adımları takip ederek yerel ortamınızda çalıştırabilirsiniz.

### Gereksinimler

- [Node.js](https://nodejs.org/) (v14 veya üzeri)
- [NPM](https://www.npmjs.com/) (Node.js ile birlikte gelir) veya [Yarn](https://yarnpkg.com/)
- [Ionic CLI](https://ionicframework.com/docs/cli/installation) (Global olarak kurulmalıdır)

### Kurulum

1. **Node.js** ve **NPM**'in kurulu olduğundan emin olun:
   ```bash
   node -v
   npm -v
   ```

2. **Ionic CLI**'yi global olarak kurun:
   ```bash
   npm install -g @ionic/cli
   ```

3. Projenizi klonlayın veya yeni bir Ionic projesi başlatın:
   ```bash
   git clone https://github.com/kullanici/proje-adi.git
   cd proje-adi
   ```

   *veya*

   ```bash
   ionic start proje-adi blank
   cd proje-adi
   ```

4. Proje bağımlılıklarını yükleyin:
   ```bash
   npm install
   ```

### Geliştirme Sunucusunu Başlatma

Projenizi yerel geliştirme ortamında çalıştırmak için aşağıdaki komutu kullanın:
```bash
ionic serve
```

Bu komut, projeyi yerel olarak `http://localhost:8100` adresinde başlatır ve dosyalarınızda yapılan değişiklikler otomatik olarak yenilenir. Bu yöntem, hızlı bir şekilde geliştirme yaparken projeyi test etmek için idealdir.

### Uygulamayı Cihaz veya Emülatörde Çalıştırma

1. **Android veya iOS platformunu ekleyin**:
   ```bash
   ionic capacitor add android
   ionic capacitor add ios
   ```

2. Uygulamayı cihazda veya emülatörde çalıştırın:
   ```bash
   ionic capacitor run android
   ionic capacitor run ios
   ```

   *Not: iOS için Mac bilgisayara ve Xcode'a ihtiyacınız vardır.*

## Proje Yapısı

Projenin genel klasör yapısı şu şekildedir:
```
proje-adi/
├── src/
│   ├── app/
│   ├── assets/
│   ├── environments/
│   └── index.html
├── capacitor.config.ts
├── package.json
└── README.md
```

## Faydalı Komutlar

- **Ionic uygulamasını paketlemek için**:
  ```bash
  ionic build
  ```

- **Capacitor komutlarını senkronize etmek için**:
  ```bash
  ionic capacitor sync
  ```

