# **8bits**

Bu proje, Ionic kullanılarak geliştirilmiş bir mobil uygulama
projesidir. Bu doküman, projeyi kurmak ve ayağa kaldırmak için gerekli
adımları içermektedir.

## **Başlarken**

Bu proje için aşağıdaki adımları takip ederek yerel ortamınızda
çalıştırabilirsiniz.

### **Gereksinimler**

-   [[Node.js]{.underline}](https://nodejs.org/) (v14 veya üzeri)

-   [[NPM]{.underline}](https://www.npmjs.com/) (Node.js ile birlikte
    > gelir)

-   Ionic CLI (Global olarak kurulmalıdır)

### **Kurulum**

**Node.js** ve **NPM**\'in kurulu olduğundan emin olun:\
node -v

npm -v

**Ionic CLI**\'yi global olarak kurun:\
npm install -g \@ionic/cli

Projenizi klonlayın:\
git clone https://github.com/kullanici/proje-adi.git

cd proje-adi

cd proje-adi

Proje bağımlılıklarını yükleyin:\
npm install

### **Geliştirme Sunucusunu Başlatma**

Projenizi yerel geliştirme ortamında çalıştırmak için aşağıdaki komutu
kullanın:

ionic serve

Bu komut, projeyi yerel olarak http://localhost:8100 adresinde başlatır
ve dosyalarınızda yapılan değişiklikler otomatik olarak yenilenir. Bu
yöntem, hızlı bir şekilde geliştirme yaparken projeyi test etmek için
idealdir.

### **Uygulamayı Cihaz veya Emülatörde Çalıştırma (Ilk asamada gerekmeyecektir)**

**Android veya iOS platformunu ekleyin**:\
ionic capacitor add android

ionic capacitor add ios

Uygulamayı cihazda veya emülatörde çalıştırın:\
\
ionic capacitor run android

ionic capacitor run ios

1.  *Not: iOS için Mac bilgisayara ve Xcode\'a ihtiyacınız vardır.*

## **Faydalı Komutlar**

**Ionic uygulamasını paketlemek için**: ionic build

**Capacitor komutlarını senkronize etmek için**: ionic capacitor sync

## **Destek**

Sorularınız veya yardıma ihtiyaç duyduğunuz durumlar için Ionic
belgelerine göz atabilirsiniz.

[[https://ionicframework.com/]{.underline}](https://ionicframework.com/)
