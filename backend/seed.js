const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Note = require('./models/Note');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB bağlantısı başarılı');
  } catch (error) {
    console.error('❌ MongoDB bağlantı hatası:', error.message);
    process.exit(1);
  }
};

const seed = async () => {
  try {
    await connectDB();

    // Mevcut kullanıcıları temizle (opsiyonel)
    // await User.deleteMany({});
    // await Note.deleteMany({});

    // Test kullanıcısı oluştur
    const testEmail = 'test@example.com';
    const testPassword = 'test123456';

    const existingUser = await User.findOne({ email: testEmail });
    
    if (existingUser) {
      console.log('⚠️ Test kullanıcısı zaten mevcut!');
      console.log(`Email: ${testEmail}`);
      console.log(`Şifre: ${testPassword}`);
      process.exit(0);
    }

    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testPassword, salt);

    // Kullanıcı oluştur
    const user = new User({
      email: testEmail,
      password: hashedPassword,
      plan: 'free'
    });

    await user.save();
    console.log('✅ Test kullanıcısı oluşturuldu!');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 TEST KULLANICI BİLGİLERİ');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email: ${testEmail}`);
    console.log(`Şifre: ${testPassword}`);
    console.log('');
    console.log('🌐 Giriş yapmak için:');
    console.log('   http://localhost:5000/login.html');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Örnek notlar oluştur (opsiyonel)
    const sampleNotes = [
      {
        title: 'Hoş Geldiniz!',
        content: 'NoteFlow\'a hoş geldiniz! Bu ilk notunuz. Yeni notlar oluşturmak için sol menüyü kullanabilirsiniz.',
        user: user._id
      },
      {
        title: 'Notlarınızı Organize Edin',
        content: 'Notlarınızı düzenleyebilir, silebilir ve arayabilirsiniz. Tüm notlarınız güvenli bir şekilde saklanır.',
        user: user._id
      },
      {
        title: 'Free Plan',
        content: 'Free plan ile 50 not oluşturabilirsiniz. Daha fazla not için premium plana geçebilirsiniz.',
        user: user._id
      }
    ];

    await Note.insertMany(sampleNotes);
    console.log('✅ Örnek notlar oluşturuldu (3 adet)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed hatası:', error.message);
    process.exit(1);
  }
};

seed();
