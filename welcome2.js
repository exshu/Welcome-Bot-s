//--------------------------------------------------// Başlangıç //--------------------------------------------------//
//--------------------------------------------------// Başlangıç //--------------------------------------------------//
//--------------------------------------------------// Başlangıç //--------------------------------------------------//

//--------------------------------------------------// Modül Tanımlama //--------------------------------------------------//
//--------------------------------------------------// Modül Tanımlama //--------------------------------------------------//

const { Client, VoiceChannel, GuildMember } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const ayarlar = require('../ayarlar')

//--------------------------------------------------// Konsol Fonksiyonları //--------------------------------------------------//
//--------------------------------------------------// Konsol Fonksiyonları //--------------------------------------------------//


function exlog(mesaj) {
console.log(`eX / Welcome's | ${mesaj} | Bot : ${client.user.tag} | Bot ID : ${client.user.id} | Bot Sırası : 2 | Tarih : [${moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}]`);
};

function exhata(hata) {
console.error(`eX / Welcome's | Botta Bir Hata Oluştu. | Bot Sırası : 2 | Tarih : [${moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}]
Hata: ${hata}`);
};

//--------------------------------------------------// Client Tanımlama //--------------------------------------------------//
//--------------------------------------------------// Client Tanımlama //--------------------------------------------------//

const client = new Client();
const Voice = client
const seslikanal = VoiceChannel
const sunucuuye = GuildMember

Voice.staffJoined = false;
Voice.playingVoice = false;
Voice.voiceConnection = null;
Voice.channelID = null;

//--------------------------------------------------// Sese Girme & Giriş Yapma //--------------------------------------------------//
//--------------------------------------------------// Sese Girme & Giriş Yapma //--------------------------------------------------//

client.on("ready", async() => {
  client.user.setPresence({ activity: { name: ayarlar.ex.footer, type: ayarlar.ex.type }, status: ayarlar.ex.status })
const Channel = client.channels.cache.get(ayarlar.odalar.welcome2)
  Channel.join().then(connection =>{        
Voice.voiceConnection = connection;
Voice.channelID = Channel.id;
  exlog(`Bot Başarıyla Ses Kanalına Bağlandı.`)
    client.guilds.cache.get(ayarlar.ex.sunucuid).members.cache.get(client.user.id).voice.setDeaf(true)
    if(!Channel.hasStaff()) playVoice(client);
   else Voice.staffJoined = true;
}).catch(err => {
  exhata(`Bot Ses Kanalına Bağlanırken Hata Oluştu.
Hata : [${err.message}]`)
});
});

//--------------------------------------------------// Giriş Yapma //--------------------------------------------------//

client.login(process.env.BOTTOKEN2).then(x => exlog(`Bot Başarıyla Giriş Yaptı`)).catch(err => exhata(`Bot Giriş Yaparen Bir Hata Oluştu.
Hata : [${err.message}]`))

//--------------------------------------------------// Sese Girince Müzik Çalma //--------------------------------------------------//
//--------------------------------------------------// Sese Girince Müzik Çalma //--------------------------------------------------//

Voice.on("voiceStateUpdate", async(oldState, newState) => {
    if(
        newState.channelID && (oldState.channelID !== newState.channelID) &&
        newState.member.isStaff() &&
        newState.channelID === Voice.channelID &&
        !newState.channel.hasStaff(newState.member)
    ) {
        Voice.staffJoined = true;
        return playVoice(Voice);
    }
    if( 
        oldState.channelID && 
        (oldState.channelID !== newState.channelID) && 
        newState.member.isStaff() && 
        oldState.channelID === Voice.channelID &&
        !oldState.channel.hasStaff()
    ) {
        Voice.staffJoined = false;
        return playVoice(Voice);
    }
});

//--------------------------------------------------// Şarkı Çalma Fonksiyonları //--------------------------------------------------//
//--------------------------------------------------// Şarkı Çalma Fonksiyonları //--------------------------------------------------//

function playVoice(Voice) {
    try {

        const Path = Voice.staffJoined === true ? ayarlar.sesler.yetkili : ayarlar.sesler.hg;
        Voice.playingVoice = true;
        Voice.voiceConnection.play(Path, {
            volume: 1
        }).on("finish", async() => {
            Voice.playingVoice = false;
            if(Voice.staffJoined === true) return;
            playVoice(Voice);
        });

    } catch(err) {

        return exhata(`Şarkı Başlatılırken Bir Hata Oluştu.
Hata : [${err.message}]`)
        
    }
};


//--------------------------------------------------// Yetkili Fonksiyonları //--------------------------------------------------//
//--------------------------------------------------// Yetkili Fonksiyonları //--------------------------------------------------//

VoiceChannel.prototype.hasStaff = function(checkMember = false) {
    if(this.members.some(m => (checkMember !== false ? m.user.id !== checkMember.id : true) && !m.user.bot && m.roles.highest.position >= m.guild.roles.cache.get(ayarlar.ex.yetkirol).position)) return true; // m.roles.highest.position >= this.guild.roles.cache.get(CONFIG.DEFAULTS.MIN_STAFF_ROLE).position
    return false;
}

VoiceChannel.prototype.getStaffs = function(checkMember = false) {
    return this.members.filter(m => (checkMember !== false ? m.user.id !== checkMember.id : true) && !m.user.bot && m.roles.highest.position >= m.guild.roles.cache.get(ayarlar.ex.yetkirol).position).size
}

GuildMember.prototype.isStaff = function() {
    if(
        !this.user.bot && 
        ([ayarlar.ex.sahipler].includes(this.id) ||
        this.hasPermission("ADMINISTRATOR") ||
        this.roles.highest.position >= this.guild.roles.cache.get(ayarlar.ex.yetkirol).position
        )
    ) return true;
    return false;
}

//--------------------------------------------------// Bitiş //--------------------------------------------------//
//--------------------------------------------------// Bitiş //--------------------------------------------------//
//--------------------------------------------------// Bitiş //--------------------------------------------------//