
# Branch Yapısı ve Kullanım Rehberi

Bu doküman, projede branch (dal) yapısını nasıl kullanmanız gerektiğini ve ekip olarak daha etkili bir iş akışı sağlamak için dikkat etmeniz gereken kuralları içerir.

## Branch Stratejisi

Projede **Git Flow** ya da benzer bir branch stratejisi kullanarak daha düzenli ve temiz bir kod tabanı oluşturabilirsiniz. Bu yapıda genellikle ana branch'ler şunlardır:

- **`main`**: Üretim ortamında çalışan, en güncel ve kararlı sürümü barındıran ana branch.
- **`develop`**: Yeni özelliklerin ve geliştirmelerin entegre edildiği test ortamı için kullanılan branch.

## Branch Türleri

### 1. Feature Branches (`feature/`)
- **Kullanım Alanı**: Yeni özellikler üzerinde çalışmak için kullanılır.
- **Adlandırma**: `feature/ozellik-adi` formatında olmalıdır (örneğin, `feature/kullanici-girisi`).
- **Oluşturma**:
  ```bash
  git checkout develop
  git pull origin develop
  git checkout -b feature/ozellik-adi
  ```

### 2. Bugfix Branches (`bugfix/`)
- **Kullanım Alanı**: Hataların düzeltilmesi için kullanılır.
- **Adlandırma**: `bugfix/hata-adi` formatında olmalıdır (örneğin, `bugfix/login-sorunu`).
- **Oluşturma**:
  ```bash
  git checkout develop
  git pull origin develop
  git checkout -b bugfix/hata-adi
  ```

### 3. Release Branches (`release/`)
- **Kullanım Alanı**: Yeni bir sürüm hazırlığı sırasında kullanılır.
- **Adlandırma**: `release/surum-adi` (örneğin, `release/v1.0.0`).
- **Oluşturma ve İş Akışı**:
  ```bash
  git checkout develop
  git pull origin develop
  git checkout -b release/v1.0.0
  ```

### 4. Hotfix Branches (`hotfix/`)
- **Kullanım Alanı**: Üretim ortamında acil olarak düzeltilmesi gereken sorunlar için kullanılır.
- **Adlandırma**: `hotfix/acil-duzeltme` formatında olmalıdır (örneğin, `hotfix/api-hatasi`).
- **Oluşturma ve İş Akışı**:
  ```bash
  git checkout main
  git pull origin main
  git checkout -b hotfix/acil-duzeltme
  ```

## Branch Kullanım Kuralları

1. **Branch Açmadan Önce Güncel Kopya Alın**: Yeni bir branch açmadan önce `develop` veya ilgili ana branch'i güncelleyin.
   ```bash
   git checkout develop
   git pull origin develop
   ```

2. **Anlamlı İsimler Kullanın**: Branch isimleri kısa, açıklayıcı ve anlaşılır olmalıdır.
3. **Düzenli Commit Mesajları**: Her commit mesajı, yapılan değişiklikleri özetlemeli ve projede neyi etkilediğini anlatmalıdır.
   ```bash
   git commit -m "Yeni kullanıcı giriş formu eklendi"
   ```

4. **Kod İncelemesi**: Tüm branch'ler `develop` veya `main` branch'ine merge edilmeden önce kod incelemesi (PR - Pull Request) sürecinden geçmelidir.

## Pull Request (PR) Süreci

1. **PR Oluşturun**: Branch üzerinde yaptığınız değişiklikler tamamlandığında `develop` veya `main` branch'ine PR oluşturun.
2. **Kod İncelemesi Yapın**: Ekip arkadaşlarınızın yaptığı incelemeleri gözden geçirin ve geri bildirimleri uygulayın.
3. **Merge Edin**: Kod incelemelerinden sonra onaylanan PR'ı branch'e merge edin.

## Özet

- **`main`** her zaman kararlı ve üretim ortamına uygun olmalıdır.
- **`develop`** test ve geliştirme süreçleri için kullanılır.
- Yeni özellikler ve hatalar için ilgili feature veya bugfix branch'lerini kullanın.
- Acil durumlar için **`hotfix`** branch'leri kullanarak hızlıca müdahale edin.
