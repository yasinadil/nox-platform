import mongoose from 'mongoose';

const userSchema = new mongoose.Schema ({

    name: String,
    walletAddress: {
        type: String,
        required: true,
        unique: true,
    },
    internalWalletAddress: {
        type: String,
        required: true,
        unique: true,
    },
    publicKey: {
        type: String,
        required: true,
        unique: true,
    },
    privateKey: {
        type: String,
        required: true,
        unique: true,
    },
});

// const User = models.User || mongoose.model("User", userSchema);
const User = mongoose.models.auth || mongoose.model('auth', userSchema);

export { User };