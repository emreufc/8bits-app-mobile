// Kayıt ol ekranında kullanılacak.
export interface UserRegister {
    name: string;
    surname: string;
    email: string;
    phoneNumber: string;
    password: string;
  }
// Profil bilgileri kısmında sergilenen bilgiler. ProfilEdit sayfasında değişiklik vesaire yapılınca.
export interface UserProfile {
    name: string;
    surname: string;
    email: string;
    phoneNumber: string;
    gender: string;
    birthday: string;
}
// Kayıtlı kullanıcının Login olurken çağırdığı bilgiler.
export interface UserLogin {
    email: string;
    password: string;
}