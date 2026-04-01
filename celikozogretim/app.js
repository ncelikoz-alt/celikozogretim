var SAYFALAR = Object.keys(ICERIK);
var aktifSayfa = 'giris';

// ── POPUP TİP SİSTEMİ ──
function initPopups() {
  var tip = document.createElement('div');
  tip.id = 'tip-box';
  tip.style.cssText = 'display:none;position:fixed;background:#0d1b6e;color:#fff;padding:10px 14px;border-radius:10px;font-size:.8rem;line-height:1.55;max-width:280px;z-index:9999;pointer-events:none;box-shadow:0 8px 24px rgba(0,0,0,.3);border-top:3px solid #c8a84b;';
  document.body.appendChild(tip);

  document.addEventListener('mouseover', function(e) {
    var el = e.target.closest('.popup-tip');
    if (!el) return;
    var text = el.getAttribute('data-tip') || el.getAttribute('data-tanim');
    if (!text) return;
    tip.textContent = text;
    tip.style.display = 'block';
  });
  document.addEventListener('mouseout', function(e) {
    if (!e.target.closest('.popup-tip')) return;
    tip.style.display = 'none';
  });
  document.addEventListener('mousemove', function(e) {
    if (tip.style.display === 'none') return;
    var x = e.clientX + 14, y = e.clientY - 10;
    if (x + 290 > window.innerWidth) x = e.clientX - 295;
    if (y + 100 > window.innerHeight) y = e.clientY - 110;
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
  });
  // Mobil: tıklama ile
  document.addEventListener('click', function(e) {
    var el = e.target.closest('.popup-tip');
    if (!el) { tip.style.display = 'none'; return; }
    var text = el.getAttribute('data-tip') || el.getAttribute('data-tanim');
    if (!text) return;
    tip.textContent = text;
    tip.style.display = 'block';
    var rect = el.getBoundingClientRect();
    tip.style.left = Math.min(rect.left, window.innerWidth - 295) + 'px';
    tip.style.top = (rect.bottom + 6) + 'px';
    e.stopPropagation();
  });
}

// ── DERİNLEŞTİRME (TOGGLE: tıklayınca aç/kapat) ──
function initDW() {
  document.querySelectorAll('.dw-tab').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var panelId = this.dataset.panel;
      var widget = this.closest('.dw-widget');
      var panel = document.getElementById(panelId);
      var isActive = this.classList.contains('dw-active');

      if (isActive) {
        // Kapat
        this.classList.remove('dw-active');
        if (panel) { panel.style.display = 'none'; panel.classList.remove('dw-show'); }
        widget.querySelector('.dw-body').style.display = 'none';
      } else {
        // Diğerlerini kapat, bunu aç
        widget.querySelectorAll('.dw-tab').forEach(function(b) {
          b.classList.remove('dw-active');
        });
        widget.querySelectorAll('.dw-panel').forEach(function(p) {
          p.style.display = 'none';
          p.classList.remove('dw-show');
        });
        widget.querySelector('.dw-body').style.display = 'block';
        this.classList.add('dw-active');
        if (panel) {
          panel.style.display = 'block';
          panel.classList.add('dw-show');
          loadMedia();
        }
      }
    });
  });
  // Başlangıçta dw-body kapalı; aktif panel hazır ama gizli
  document.querySelectorAll('.dw-widget').forEach(function(widget) {
    var body = widget.querySelector('.dw-body');
    if (body) body.style.display = 'none';
    // Tüm panelleri gizle (dw-show bile olsa)
    widget.querySelectorAll('.dw-panel').forEach(function(p) {
      p.style.display = 'none';
    });
    // Aktif tab'ın panelini hazırla (display none ama ilk tıkta gösterilecek)
    var activeTab = widget.querySelector('.dw-tab.dw-active');
    if (activeTab) {
      var activePanelId = activeTab.dataset.panel;
      var activePanel = document.getElementById(activePanelId);
      // Panel hazır - ilk tıkta açılacak
    }
  });
}

// ── ALT BUTON TOGGLE (Gör/Dinle alt butonları) ──
function toggleSubVideo(targetId, btn) {
  var container = btn.parentElement;
  var allBtns = container.querySelectorAll('button');
  var target = document.getElementById(targetId);
  if (!target) return;
  var isVisible = target.style.display === 'block';
  // Tüm kardeş videoları kapat
  var parent = target.parentElement;
  parent.querySelectorAll('[id$="-video"]').forEach(function(v) {
    v.style.display = 'none';
  });
  // Tüm butonları varsayılan stile döndür
  var accentColor = '#c62828';
  allBtns.forEach(function(b) {
    if (b.dataset.accent) accentColor = b.dataset.accent;
    b.style.background = '#fff';
    b.style.color = b.dataset.accent || accentColor;
  });
  // Eğer zaten açıksa kapat, değilse aç
  if (!isVisible) {
    target.style.display = 'block';
    btn.style.background = btn.dataset.accent || accentColor;
    btn.style.color = '#fff';
  }
}

// ── MEDIA YÜKLEMESİ ──
function loadMedia() {
  // İnfografik
  var img = document.getElementById('inf-img');
  if (img && img.src === '' && typeof MEDIA !== 'undefined') {
    img.src = MEDIA.infografik;
    img.style.display = 'block';
    var ph = document.getElementById('inf-ph');
    if (ph) ph.style.display = 'none';
  }
  // Ses
  document.querySelectorAll('[id^="ses-player-"]').forEach(function(el) {
    if (el.innerHTML !== '') return;
    if (typeof MEDIA !== 'undefined' && MEDIA && MEDIA.ses_ogrenme) {
      el.innerHTML = '<audio controls style="width:100%;max-width:440px"><source src="' + MEDIA.ses_ogrenme + '" type="audio/mpeg"></audio>';
    }
    // Ses dosyası henüz yüklü değilse sessiz kal — zaten placeholder metni var
  });
}

// ── KAVRAM HARİTASI ──
function initHarita() {
  var S = {}, Z = 1;
  var IDS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
  function tgl(id) {
    var a=document.getElementById('ag-'+id), b=document.getElementById('bc-'+id), o=document.getElementById('ok-'+id);
    if (!a) return;
    if (S[id]) { a.classList.remove('ac'); if(b)b.classList.remove('ac'); if(o)o.classList.remove('ro'); S[id]=false; }
    else { a.classList.add('ac'); if(b)b.classList.add('ac'); if(o)o.classList.add('ro'); S[id]=true; }
  }
  window.tgl = tgl; window.pop = function(){}; window.hid = function(){};
  var ac=document.getElementById('kbac'), kp=document.getElementById('kbkp');
  var byu=document.getElementById('kbbyu'), kuc=document.getElementById('kbkuc'), sfr=document.getElementById('kbsfr');
  if(ac) ac.addEventListener('click', function() { IDS.forEach(function(id){var a=document.getElementById('ag-'+id),b=document.getElementById('bc-'+id),o=document.getElementById('ok-'+id);if(a){a.classList.add('ac');if(b)b.classList.add('ac');if(o)o.classList.add('ro');S[id]=true;}}); });
  if(kp) kp.addEventListener('click', function() { IDS.forEach(function(id){var a=document.getElementById('ag-'+id),b=document.getElementById('bc-'+id),o=document.getElementById('ok-'+id);if(a){a.classList.remove('ac');if(b)b.classList.remove('ac');if(o)o.classList.remove('ro');S[id]=false;}}); });
  if(byu) byu.addEventListener('click', function() { Z=Math.min(Z*1.25,3); var s=document.getElementById('kms'); if(s)s.style.width=Math.round(1000*Z)+'px'; });
  if(kuc) kuc.addEventListener('click', function() { Z=Math.max(Z*0.8,0.35); var s=document.getElementById('kms'); if(s)s.style.width=Math.round(1000*Z)+'px'; });
  if(sfr) sfr.addEventListener('click', function() { Z=1; var s=document.getElementById('kms'); if(s)s.style.width='100%'; });


  if (!document.getElementById('km-st')) {
    var st=document.createElement('style'); st.id='km-st';
    st.textContent='.ag{display:none}.ag.ac{display:block}.bc{display:none}.bc.ac{display:block}.ok{font-size:9px;transform-box:fill-box;transform-origin:center;transition:transform .2s}.ok.ro{transform:rotate(90deg)}.ad{cursor:pointer}';
    document.head.appendChild(st);
  }

  // SVG node popup'ları
  var kmw = document.getElementById('kmw');
  if (kmw) {
    kmw.querySelectorAll('.ad').forEach(function(el) {
      el.addEventListener('mouseenter', function(e) {
        // SVG text elementini bul - tüm text nodeları kontrol et
        var label = '';
        var texts = el.querySelectorAll('text');
        texts.forEach(function(t) { if(t.textContent.trim().length > 1) label = t.textContent.trim(); });
        if(!label) return;
        var tip = document.getElementById('tip-box');
        if (!tip || !label) return;
        // Harita kavramları için kısa açıklamalar
        var desc = {
        "EĞİTİM": "Topluma istendik davranışları kazandırmakla görevlendirilmiş kurum. Bireyin bilgi, beceri, tutum ve değerlerinde kasıtlı ve planlı değişiklikler oluşturma sürecidir.",
        "Okul": "Eğitimin gerçekleştiği, planlı davranış değişikliklerinin oluşturulması için tahsis edilmiş genel ortam. Formal eğitimin temel kurumudur.",
        "İlke": "Öğrenme ve öğretime yön veren evrensel doğrular. Öğretim sürecinin tüm aşamalarında geçerliliğini koruyan temel rehber kurallardır.",
        "Öğretmen": "İşi öğretimdir. Öğrenmeyi kılavuzlar; hedefler doğrultusunda ortamları düzenler. Çağdaş anlayışta bilgi aktarıcı değil, öğrenme sürecinin tasarımcısı ve rehberidir.",
        "Ortam ve İmkanlar": "Öğretimin gerçekleştiği fiziksel mekânlar ve kullanılan araç-gereç kaynakları. Sınıf, laboratuvar, atölye ve teknolojik araçları kapsar.",
        "Öğretim": "Öğrencide istendik davranış değişikliği oluşturmak amacıyla yürütülen planlı etkinliklerin bütünü. Eğitimin programlı ve sistemli kısmıdır.",
        "Öğrenci": "İşi öğrenmektir. Bilgi, beceri, tavır, tutum ve alışkanlık kazanır. Öğrenme sürecinin odak noktası ve baş aktörüdür.",
        "Öğrenme İlkeleri": "Etkili öğrenmenin gerçekleşmesi için gözetilmesi gereken temel kurallar. Araştırma bulgularından elde edilen evrensel öğrenme gerçekleridir.",
        "Öğrenci Özellikleri": "Öğrencinin öğrenme sürecini etkileyen bilişsel, duyuşsal ve sosyal özellikleri. Motivasyon, hazır bulunuşluk, gelişim düzeyi ve kültürel bağlamı kapsar.",
        "Öğrenme Kuramları": "Öğrenmenin nasıl gerçekleştiğini açıklamaya çalışan bilimsel çerçeveler. Davranışçılık, bilişselcilik, yapılandırmacılık ve hümanizm başlıca kuramlardır.",
        "Öğrenme Yaklaşımları": "Öğrenmenin nasıl organize edileceğine ilişkin genel yönelimler. Öğrenen merkezli, deneyimsel, işbirlikçi gibi farklı yaklaşımlar içerir.",
        "Öğrenme Modelleri": "Öğrenme sürecini sistematik biçimde açıklayan teorik çerçeveler. Bilgi İşleme Modeli, Kolb Modeli ve Çoklu Zeka bunlara örnektir.",
        "Öğrenme Stratejileri": "Öğrencinin bilgiyi işleme ve öğrenmeyi kolaylaştırma yöntemleri. Dikkat, tekrar, anlamlandırma, örgütleme ve yürütücü biliş stratejilerini kapsar.",
        "Öğretim İlkeleri": "Etkili öğretimi sağlamak için öğretmene rehberlik eden temel kurallar. Somuttan soyuta, bilinenden bilinmeyene gibi ilkeleri içerir.",
        "Öğretim Kuramları": "Öğretimin nasıl tasarlanması gerektiğini açıklayan bilimsel yaklaşımlar. Öğrenme kuramlarını uygulamaya aktaran çerçevelerdir.",
        "Öğretim Yaklaşımları": "Öğretim sürecinin kimin merkezde olduğuna göre şekillenen genel yönelimler. Öğretmen merkezli, öğrenci merkezli ve yapılandırmacı yaklaşımlar öne çıkar.",
        "Öğretim Modelleri": "Öğretim sürecini adım adım planlayan sistematik çerçeveler. 5E Modeli, ADDIE, Bloom Taksonomisi buna örnektir.",
        "Öğretim Stratejileri": "Öğretmenin içeriği öğrenciye ulaştırmak için seçtiği genel öğretim yolları. Aktarım, sorgulama, deneyim ve bireysel öğretim stratejileri içerir.",
        "Öğretim Yöntemleri": "Öğretme işinde kullanılan sistematik uygulama yolları. Anlatım, tartışma, problem çözme, proje gibi yöntemler bu kapsamdadır.",
        "Öğretim Teknikleri": "Yöntemlerin sınıf içinde uygulanmasını somutlaştıran özgün işlemler. Beyin fırtınası, balık kılçığı, rol oynama gibi teknikler örnek verilebilir.",
        "Motivasyon": "Öğrencinin öğrenmeye yönelik içsel ve dışsal güdülenme durumu. Başarı beklentisi, ilgi ve öz-yeterlik algısından etkilenir.",
        "Gelişim Düzeyi": "Öğrencinin bilişsel, duyuşsal ve psikomotor gelişim aşaması. Piaget'in bilişsel gelişim evreleri bu kapsamda değerlendirilebilir.",
        "Sosyo-Kültürel Bağlam": "Öğrencinin sosyal çevresi, kültürel değerleri ve aile yapısının öğrenmeye etkisi.",
        "Davranışçılık": "Öğrenmeyi uyarıcı-tepki bağının güçlenmesi olarak açıklayan kuram. Pavlov, Watson ve Skinner bu kuramın öncüleridir.",
        "Bilişselcilik": "Öğrenmeyi zihinsel işlemleme süreci olarak ele alan kuram. Bilginin nasıl alındığı, işlendiği ve depolandığını inceler.",
        "Yapılandırmacılık": "Bireyin bilgiyi pasif almak yerine, deneyim ve etkileşim yoluyla bizzat inşa ettiğini savunan kuram.",
        "Bağlantısalcılık": "Öğrenmeyi dijital çağda ağ bağlantıları üzerinden açıklayan güncel kuram. Siemens tarafından geliştirilmiştir.",
        "Hümanist": "Bireyin kendini gerçekleştirmesini ve bütüncül gelişimini ön plana alan yaklaşım. Maslow ve Rogers öncüleridir.",
        "Nörobilimsel": "Beyin ve sinir sistemi araştırmalarına dayanan öğrenme yaklaşımı. Nörolojik bulguları eğitime yansıtır.",
        "Bilgi İşleme Modeli": "Duyusal kayıttan kısa süreli belleğe, oradan uzun süreli belleğe bilgi aktarımını açıklayan model.",
        "Kolb Deneyim": "Somut deneyim, yansıtıcı gözlem, soyut kavramsallaştırma ve aktif deneme aşamalarından oluşan döngüsel öğrenme modeli.",
        "Çoklu Zeka": "Howard Gardner tarafından geliştirilen; sözel, mantıksal, müzikal, görsel, bedensel, kişilerarası, içsel ve doğa zekasını tanımlayan model.",
        "Dikkat": "Öğrenilecek materyale odaklanma stratejisi. Seçici dikkat öğrenmenin ilk ve temel basamağıdır.",
        "Tekrar": "Bilgileri pekiştirmek için yineleme stratejisi. Aralıklı tekrar uzun süreli hatırlamayı artırır.",
        "Anlamlandırma": "Yeni bilgiyi var olan bilgiyle ilişkilendirme stratejisi. Anlam haritaları ve örnekleme bu amaçla kullanılır.",
        "Örgütleme": "Bilgileri sistematik biçimde düzenleme stratejisi. Kavram haritaları ve özetleme araçları kullanılır.",
        "Yürütücü Biliş": "Kendi öğrenme sürecini izleme ve yönetme stratejisi. Üst biliş olarak da bilinir.",
        "Doğrudan Öğretim": "Öğretmenin sistematik anlatım ve gösteriyle yürüttüğü öğretim modeli.",
        "Buluş Yoluyla Öğretim": "Öğrencinin rehberli keşif yoluyla kavramlara ulaştığı model. Bruner tarafından geliştirilmiştir.",
        "İşbirlikçi Öğretim": "Grup çalışması ve akran öğrenmesine dayanan öğretim modeli. Sosyal öğrenmeyi ön plana çıkarır.",
        "Aktarım": "Öğretmenin bilgiyi doğrudan aktardığı strateji. Anlatım ve sunuş yoluyla öğretme bu stratejiye örnektir.",
        "Etkileşim": "Soru-cevap, tartışma ve diyaloğa dayalı öğretim stratejisi.",
        "Sorgulama": "Öğrencinin araştırıp sorguladığı, eleştirel düşünmeyi geliştiren strateji.",
        "Deneyim": "Yaparak yaşayarak öğrenme stratejisi. Deney, proje ve saha çalışmalarını kapsar.",
        "Yerinde Öğretim": "Gerçek yaşam ortamında yürütülen öğretim stratejisi. Gezi-gözlem ve staj buna örnektir.",
        "Bireysel Öğretim": "Öğrencinin bireysel hızına ve ihtiyaçlarına göre düzenlenen strateji.",
        "Anlatım": "Öğretmenin konuyu sözlü olarak aktardığı temel öğretim yöntemi.",
        "Gösterip Yaptırma": "Öğretmenin önce gösterip ardından öğrenciye uygulatmak için yaptırdığı yöntem.",
        "Tartışma": "Fikir alışverişi ve argümanasyona dayalı öğretim yöntemi.",
        "Problem Çözme": "Öğrencinin gerçek problemleri analiz ederek çözdüğü yöntem.",
        "Proje": "Uzun süreli, kapsamlı araştırma ve üretime dayalı yöntem.",
        "Drama": "Rol yapma ve canlandırmaya dayalı öğretim yöntemi.",
        "Oyun": "Oyun tabanlı öğrenme yöntemi. Motivasyon ve katılımı artırır.",
        "Gezi": "Gerçek ortamda gözlem ve inceleme yöntemi.",
        "Öğrenci Merkezli": "Öğrencinin aktif rol üstlendiği, keşfettiği ve kendi anlam dünyasını kurduğu öğretim anlayışı.",
        "Öğretmen Merkezli": "Bilginin otorite konumundaki öğretmenden öğrenciye aktarıldığı geleneksel anlayış.",
        "Yapılandırmacı": "Öğrencinin bilgiyi bizzat inşa ettiği, öğretmenin kolaylaştırıcı rolüstlendiği anlayış.",
        "Farklılaştırılmış Öğretim": "Her öğrencinin bireysel ihtiyaç, ilgi ve hazır bulunuşluğuna göre uyarlanan öğretim yaklaşımı.",
        "ÖĞRETİM": "Belirli hedefler doğrultusunda bilgi, beceri ve tutumların öğrencilere sistematik biçimde kazandırılması süreci.",
        "Sınıf": "Temel öğretim ortamı. Fiziksel düzeni, oturma planı ve atmosferi öğrenmeyi doğrudan etkiler.",
        "Atölye": "Uygulamalı ve beceri odaklı çalışmalar için düzenlenmiş öğrenme ortamı.",
        "Laboratuvar": "Deney, gözlem ve bilimsel araştırma ortamı.",
        "Materyal-Teknoloji": "Öğretimde kullanılan araç-gereç ve teknolojik kaynaklar.",
        "Zaman-Program": "Öğretimin planlandığı zaman dilimleri ve program yapısı.",
        "Yeni Öğrenme": "İlk kez kazanılan bilgi, beceri veya tutumlar.",
        "Kavramsal Öğrenme": "Kavramlar arası ilişkileri anlama ve anlamlandırma düzeyinde öğrenme.",
        "Düzeltici Öğrenme": "Yanlış ya da eksik öğrenmelerin giderilmesi yoluyla gerçekleşen öğrenme.",
        "Harmonizasyon Öğr.": "Yeni bilginin var olan bilgi yapısıyla uyumlu hale getirilmesi süreci.",
        "Proje Tabanlı Öğr.": "Gerçek dünya problemlerine odaklanan uzun soluklu proje çalışmalarına dayalı öğrenme.",
        "Derin Öğrenme": "Yüzeysel ezberden öte, kavramlar arası ilişkileri içselleştiren anlamlı öğrenme."
};

        var d = desc[label];
        if (!d) d = label + ' kavramı';
        tip.textContent = d;
        tip.style.display = 'block';
        var x = e.clientX + 14, y = e.clientY - 10;
        if (x + 290 > window.innerWidth) x = e.clientX - 295;
        if (y + 80 > window.innerHeight) y = e.clientY - 90;
        tip.style.left = x + 'px';
        tip.style.top = y + 'px';
      });
      el.addEventListener('mouseleave', function() {
        var tip = document.getElementById('tip-box');
        if (tip) tip.style.display = 'none';
      });
    });
  }

}

// ── BULMACA ──
function initBulmaca() {
  var ANSWER=["####S####################","####T##################B#","####R##################I#","####A############TUTUM#L#","####T##############E###G#","####E############YAKLASIM","#H##J##############N#####","#E#BIREY####O#KALICI#####","#D#####O#O##G#U####K#####","BECERI#N#G##R#R##########","#F###L#T#R##E#A##########","#####K#E#EGITIM##########","##OGRETMEN##I############","#########M##M############","######MODEL##############","########A################","########V################","#####Y##R################","#####A##A################","#####S##N################","#####AKTIF###############","#####N##S################","#####T###################","#####I###################"];
  var ROWS=ANSWER.length, COLS=ANSWER[0].length;
  var WORDS=[[1,'down',0,4,'STRATEJI','Hedefe ulaşmak için belirlenen genel yol'],[2,'down',1,23,'BILGI','Öğrenme sonucunda kazanılan kavrayış'],[3,'across',3,17,'TUTUM','Bireyin bir nesneye yönelik eğilim ve davranış biçimi'],[4,'down',3,19,'TEKNIK','Yöntemin sınıf içindeki mikro uygulama biçimi'],[5,'across',5,17,'YAKLASIM','Kuramın eğitim bağlamına taşınan genel bakış açısı (8 harf)'],[6,'down',6,1,'HEDEF','Öğretim sürecinde ulaşılmak istenen öğrenme çıktısı'],[7,'across',7,3,'BIREY','Öğrenmenin öznesi'],[8,'down',7,7,'YONTEM','Sistemli öğretme yolu'],[9,'down',7,12,'OGRETIM','Eğitimin planlı ve programlı kısmı'],[10,'across',7,14,'KALICI','Öğrenmenin temel koşulu; geçici olmayan değişiklik'],[10,'down',7,14,'KURAM','Sistemli bilgi bütünü'],[11,'down',8,9,'OGRENME','Kalıcı izli davranış değişikliği'],[12,'across',9,0,'BECERI','Öğrencinin yapıp-etme gücü'],[13,'down',9,5,'ILKE','Evrensel temel kural'],[14,'across',11,9,'EGITIM','Kasıtlı istendik davranış değişikliği süreci'],[15,'across',12,2,'OGRETMEN','Öğrenmeyi kılavuzlayan eğitim uzmanı (8 harf)'],[16,'across',14,6,'MODEL','Sistemli öğretim tasarımı'],[17,'down',14,8,'DAVRANIS','Gözlemlenebilir tepkiler (8 harf)'],[18,'down',17,5,'YASANTI','Öğrenmeyi sağlayan deneyim (7 harf)'],[19,'across',20,5,'AKTIF','Öğrenme sürecine etkin katılım']];
  var cellNum={}, cells={}, selR=-1, selC=-1, selDir='across';
  WORDS.forEach(function(w){ var k=w[2]+','+w[3]; if(!cellNum[k]) cellNum[k]=w[0]; });

  var tbl=document.getElementById('tbl');
  if(!tbl) return;

  // Tablo stilini ayarla - tüm hücreler eşit
  tbl.style.cssText='border-collapse:collapse;table-layout:fixed;width:auto;';

  for(var r=0;r<ROWS;r++){
    var tr=document.createElement('tr');
    for(var c=0;c<COLS;c++){
      var td=document.createElement('td'), ch=ANSWER[r][c];
      // Eşit kare boyutu
      td.style.cssText='width:34px;height:34px;min-width:34px;min-height:34px;padding:0;position:relative;';
      if(ch==='#'){
        td.className='black';
        td.style.background='#2c3e6b';
      } else {
        td.className='white';
        td.style.background='#f8fafc';
        td.style.border='1px solid #c5d0de';
        var k=r+','+c;
        if(cellNum[k]){
          var sp=document.createElement('span');
          sp.className='cell-num';
          sp.style.cssText='position:absolute;top:1px;left:2px;font-size:14px;font-weight:800;color:#1565c0;line-height:1;pointer-events:none;z-index:1;';
          sp.textContent=cellNum[k];
          td.appendChild(sp);
        }
        var inp=document.createElement('input');
        inp.className='cell-inp';
        inp.style.cssText='width:100%;height:100%;border:none;background:transparent;text-align:center;font-size:12px;font-weight:700;color:#1a2b5e;text-transform:uppercase;outline:none;cursor:pointer;padding:0;caret-color:transparent;position:relative;z-index:2;';
        inp.maxLength=1;
        inp.setAttribute('data-r',r);
        inp.setAttribute('data-c',c);
        inp.addEventListener('keydown', onKey);
        inp.addEventListener('click', function(){ selCell(+this.getAttribute('data-r'),+this.getAttribute('data-c'),true); });
        inp.addEventListener('input', function(){
          var v=this.value.replace(/[^a-zA-Z\u011f\u00fc\u015f\u00f6\u00e7\u0131\u011e\u00dc\u015e\u00d6\u00c7\u0130]/g,'');
          this.value = v ? v[v.length-1].toUpperCase() : '';
          if(this.value) mvNext(+this.getAttribute('data-r'),+this.getAttribute('data-c'));
        });
        td.appendChild(inp);
        cells[k]=td;
      }
      tr.appendChild(td);
    }
    tbl.appendChild(tr);
  }

  function gw(r,c,d){
    for(var i=0;i<WORDS.length;i++){
      var w=WORDS[i]; if(w[1]!==d) continue;
      var wr=w[2],wc=w[3],wl=w[4];
      if(d==='across'){if(r===wr&&c>=wc&&c<wc+wl.length)return w;}
      else{if(c===wc&&r>=wr&&r<wr+wl.length)return w;}
    }
    return null;
  }

  function selCell(r,c,tog){
    if(r===selR&&c===selC&&tog){
      var ot=selDir==='across'?'down':'across';
      if(gw(r,c,ot))selDir=ot;
    }
    if(!gw(r,c,selDir)) selDir=selDir==='across'?'down':'across';
    selR=r; selC=c; hlW();
    var inp=cells[r+','+c]&&cells[r+','+c].querySelector('input');
    if(inp) inp.focus({preventScroll:true});
    updCl();
  }

  function hlW(){
    Object.keys(cells).forEach(function(k){
      cells[k].style.background='#f8fafc';
      cells[k].classList.remove('selected','word-sel');
    });
    if(selR<0) return;
    var w=gw(selR,selC,selDir);
    if(!w) return;
    for(var i=0;i<w[4].length;i++){
      var r2=w[2],c2=w[3];
      if(w[1]==='across') c2+=i; else r2+=i;
      var td=cells[r2+','+c2];
      if(td){ td.style.background='#e8f4fd'; td.classList.add('word-sel'); }
    }
    var s=cells[selR+','+selC];
    if(s){ s.style.background='#cde4fa'; s.classList.remove('word-sel'); s.classList.add('selected'); }
  }

  function mvNext(r,c){
    var w=gw(r,c,selDir); if(!w) return;
    var nr=-1, nc=-1;
    if(selDir==='across'){
      if(c+1<w[3]+w[4].length){ nr=r; nc=c+1; }
    } else {
      if(r+1<w[2]+w[4].length){ nr=r+1; nc=c; }
    }
    if(nr>=0){
      selCell(nr,nc,false);
      // scroll yok — preventScroll zaten aktif
    }
  }

  function onKey(e){
    var r=+this.getAttribute('data-r'), c=+this.getAttribute('data-c');
    if(e.key==='ArrowRight'){e.preventDefault();if(cells[r+','+(c+1)]&&ANSWER[r][c+1]!=='#')selCell(r,c+1,false);}
    else if(e.key==='ArrowLeft'){e.preventDefault();if(cells[r+','+(c-1)]&&ANSWER[r][c-1]!=='#')selCell(r,c-1,false);}
    else if(e.key==='ArrowDown'){e.preventDefault();if(cells[(r+1)+','+c]&&ANSWER[r+1]&&ANSWER[r+1][c]!=='#')selCell(r+1,c,false);}
    else if(e.key==='ArrowUp'){e.preventDefault();if(cells[(r-1)+','+c]&&ANSWER[r-1]&&ANSWER[r-1][c]!=='#')selCell(r-1,c,false);}
    else if(e.key==='Backspace'){
      var inp=this;
      if(!inp.value){
        if(selDir==='across'&&c>0&&cells[r+','+(c-1)]){selCell(r,c-1,false);var pi=cells[r+','+(c-1)].querySelector('input');if(pi)pi.value='';}
        else if(selDir==='down'&&r>0&&cells[(r-1)+','+c]){selCell(r-1,c,false);var pi2=cells[(r-1)+','+c].querySelector('input');if(pi2)pi2.value='';}
      }
      var td2=cells[r+','+c];if(td2){td2.style.background='#f8fafc';td2.classList.remove('correct','wrong','revealed');}
    }
    else if(e.key==='Tab') e.preventDefault();
  }

  function norm(s){ return s.toUpperCase().replace(/[\u0130I]/g,'I').replace(/[\u011e\u011f]/g,'G').replace(/[\u015e\u015f]/g,'S').replace(/[\u00dc\u00fc]/g,'U').replace(/[\u00d6\u00f6]/g,'O').replace(/[\u00c7\u00e7]/g,'C').replace(/\u0131/g,'I'); }

  var chk=document.getElementById('b-chk'), rev=document.getElementById('b-rev'), rst=document.getElementById('b-rst');
  if(chk) chk.addEventListener('click', function(){
    var tot=0,cor=0,fil=0;
    for(var r=0;r<ROWS;r++){for(var c=0;c<COLS;c++){
      if(ANSWER[r][c]==='#') continue; tot++;
      var td=cells[r+','+c]; if(!td) continue;
      var inp=td.querySelector('input');
      if(!inp||!inp.value){td.style.background='#f8fafc';continue;}
      fil++;
      if(norm(inp.value)===ANSWER[r][c]){td.style.background='#c8efd4';td.classList.add('correct');cor++;}
      else{td.style.background='#fdd';td.classList.add('wrong');}
    }}
    var sb=document.getElementById('score-box');
    if(!sb) return;
    if(fil===0){sb.textContent='Henüz hiçbir hücre doldurulmadı.';sb.style.color='#546e7a';return;}
    var pct=Math.round(cor/tot*100);
    if(cor===tot){sb.innerHTML='Mükemmel! Tüm '+tot+' harf doğru!';sb.style.color='#2e7d32';}
    else{sb.innerHTML=cor+' / '+tot+' harf doğru — %'+pct+' başarı';sb.style.color='#1565c0';}
  });
  if(rev) rev.addEventListener('click', function(){
    for(var r=0;r<ROWS;r++){for(var c=0;c<COLS;c++){
      if(ANSWER[r][c]==='#') continue;
      var td=cells[r+','+c]; if(!td) continue;
      var inp=td.querySelector('input'); if(inp) inp.value=ANSWER[r][c];
      td.style.background='#fef9c3';
    }}
    var sb=document.getElementById('score-box');
    if(sb){sb.innerHTML='Tüm cevaplar gösterildi.';sb.style.color='#6a1b9a';}
  });
  if(rst) rst.addEventListener('click', function(){
    for(var r=0;r<ROWS;r++){for(var c=0;c<COLS;c++){
      if(ANSWER[r][c]==='#') continue;
      var td=cells[r+','+c]; if(!td) continue;
      var inp=td.querySelector('input'); if(inp) inp.value='';
      td.style.background='#f8fafc';
      td.classList.remove('correct','wrong','revealed','selected','word-sel');
    }}
    var sb=document.getElementById('score-box');
    if(sb) sb.textContent='';
    selR=-1; selC=-1;
  });

  // Ipuçları listesi
  var acr=[],dwn=[],seen={};
  WORDS.forEach(function(w){var k=w[0]+w[1];if(seen[k])return;seen[k]=1;var it={num:w[0],dir:w[1],clue:w[5],r:w[2],c:w[3]};if(w[1]==='across')acr.push(it);else dwn.push(it);});
  acr.sort(function(a,b){return a.num-b.num;}); dwn.sort(function(a,b){return a.num-b.num;});
  function mkList(items,cid){
    var el=document.getElementById(cid); if(!el) return;
    items.forEach(function(it){
      var d=document.createElement('div'); d.className='clue-item'; d.id='clue-'+it.num+'-'+it.dir;
      var s1=document.createElement('span'); s1.className='clue-num'; s1.textContent=it.num+'.';
      var s2=document.createElement('span'); s2.className='clue-txt'; s2.textContent=it.clue;
      d.appendChild(s1); d.appendChild(s2);
      d.addEventListener('click',function(){
        selDir=it.dir; selCell(it.r,it.c,false);
        // inp.scrollIntoView kaldırıldı — preventScroll:true focus yeterli
      });
      el.appendChild(d);
    });
  }
  mkList(acr,'across-list'); mkList(dwn,'down-list');
  function updCl(){
    document.querySelectorAll('.clue-item').forEach(function(el){el.classList.remove('active');});
    var w=gw(selR,selC,selDir); if(!w) return;
    var el=document.getElementById('clue-'+w[0]+'-'+w[1]);
    if(el){
      el.classList.add('active');
      // Container içinde scroll et — sayfayı kaydırma
      var container=el.closest('.clue-list');
      if(container){
        var top=el.offsetTop-container.offsetTop-container.clientHeight/2+el.clientHeight/2;
        container.scrollTop=Math.max(0,top);
      }
    }
  }
}

// ── TEST ──
function initTest() {
  var TQ=[
    {s:"Aşağıdaki tanımlardan hangisi eğitim kavramını en doğru biçimde açıklamaktadır?",o:["Bireyin biyolojik olarak büyüme ve gelişme sürecidir.","Bireyin davranışlarında kendi yaşantısı yoluyla kasıtlı olarak istendik değişiklik meydana getirme sürecidir.","Bireyin okul dışında edindiği deneyimlerin bütünüdür.","Öğretmenin sınıfta kullandığı yöntem ve tekniklerin toplamıdır."],d:1},
    {s:"Öğrenmenin temel özelliklerinden biri aşağıdakilerden hangisidir?",o:["Öğrenme yalnızca okul ortamında gerçekleşir.","Öğrenme geçici bir davranış değişikliğidir.","Öğrenme bireyin yaşantıları sonucunda meydana gelen kalıcı izli davranış değişikliğidir.","Öğrenme yalnızca bilişsel alanda gerçekleşir."],d:2},
    {s:"Öğretim kavramı için aşağıdakilerden hangisi doğrudur?",o:["Öğretim eğitimden daha geniş bir kavramdır.","Öğretim bireyin kendiliğinden öğrenmesidir.","Öğretim belirli hedefler doğrultusunda sistemli biçimde bilgi, beceri ve tutum kazandırma sürecidir.","Öğretim yalnızca öğretmenin ders anlatmasıdır."],d:2},
    {s:"Kuram kavramı eğitim bilimlerinde neyi ifade eder?",o:["Sınıf içi pratik uygulamaları","Öğrenme ve öğretme süreçlerini açıklayan bilimsel açıklama sistemini","Öğretmenin yıllık planını","Ölçme-değerlendirme araçlarının bütününü"],d:1},
    {s:"'Somuttan soyuta' ve 'basitten karmaşığa' hangi kavrama örnektir?",o:["Öğretim stratejisi","Öğretim ilkesi","Öğretim tekniği","Öğretim modeli"],d:1},
    {s:"Strateji kavramı öğretim sürecinde ne anlama gelir?",o:["Öğretmenin kullandığı somut etkinlikler","Hedefe ulaşmak için belirlenen genel yol","Öğretim programındaki hedeflerin listesi","Öğrencilerin not aldığı biçim"],d:1},
    {s:"Öğretim tekniği ile öğretim yöntemi arasındaki ilişki için hangisi doğrudur?",o:["Yöntem teknikten daha somuttur.","Teknik yöntemin sınıf içindeki mikro uygulama biçimidir.","Yöntem ve teknik birbirinin yerine kullanılabilir.","Teknik stratejiyi doğrudan belirler."],d:1},
    {s:"Yapılandırmacı öğrenme yaklaşımına göre hangisi doğrudur?",o:["Birey bilgiyi pasif alır.","Birey bilgiyi deneyim ve keşif yoluyla inşa eder.","Öğretmen bilginin tek kaynağıdır.","Öğrenme yalnızca pekiştirme yoluyla gerçekleşir."],d:1},
    {s:"Çağdaş anlayışa göre öğretmenin temel rolü nedir?",o:["Yalnızca bilgi aktaran otorite","Öğrenme sürecinin rehberi ve düzenleyicisi","Temel görevi sınav sorusu hazırlamak","Yalnızca müfredatı uygulamak"],d:1},
    {s:"Eğitim, öğretim ve öğrenme için hiyerarşik ilişki hangisidir?",o:["Öğretim eğitimden daha geniştir.","Eğitim en geniş; öğretim planlı kısmı; öğrenme bireydeki sonucu ifade eder.","Öğrenme ve öğretim özdeştir.","Öğretim öğrenmeden bağımsızdır."],d:1}
  ];
  var tw=document.getElementById('tsorular');
  if(!tw) return;
  TQ.forEach(function(q,qi){
    var div=document.createElement('div');
    div.style.cssText='background:#fff;border:1.5px solid #e3e8f0;border-radius:12px;padding:16px 18px;margin-bottom:14px;';
    var no=document.createElement('div');no.style.cssText='font-size:.72rem;font-weight:700;color:#1565c0;text-transform:uppercase;margin-bottom:6px;';no.textContent='Soru '+(qi+1);
    var st=document.createElement('div');st.style.cssText='font-size:.92rem;font-weight:600;color:#1a237e;margin-bottom:10px;line-height:1.5;';st.textContent=q.s;
    div.appendChild(no); div.appendChild(st);
    q.o.forEach(function(opt,oi){
      var lbl=document.createElement('label');lbl.style.cssText='display:block;padding:7px 11px;border-radius:8px;cursor:pointer;font-size:.88rem;color:#374151;margin-bottom:5px;';
      var r=document.createElement('input');r.type='radio';r.name='tq'+qi;r.value=oi;r.style.marginRight='8px';
      lbl.appendChild(r);lbl.appendChild(document.createTextNode(opt));div.appendChild(lbl);
    });
    tw.appendChild(div);
  });
  var tchk=document.getElementById('tchk'), trst=document.getElementById('trst');
  if(tchk) tchk.addEventListener('click', function(){
    var cor=0,ans=0;
    TQ.forEach(function(q,qi){
      var rads=document.querySelectorAll('[name=tq'+qi+']'), sel=-1;
      rads.forEach(function(r){if(r.checked)sel=+r.value;});
      var labels=document.querySelectorAll('#tsorular>div:nth-child('+(qi+1)+') label');
      labels.forEach(function(l,li){l.style.background='';if(li===q.d){l.style.background=sel===li?'#c8e6c9':'#fff9c4';}else if(li===sel&&sel!==q.d){l.style.background='#ffcdd2';}});
      if(sel>=0){ans++;if(sel===q.d)cor++;}
    });
    var sb=document.getElementById('tsonuc');
    if(ans===0){sb.textContent='Lütfen en az bir soruyu yanıtlayınız.';sb.style.color='#546e7a';return;}
    var pct=Math.round(cor/TQ.length*100);
    if(pct===100){sb.textContent='🎉 Mükemmel! Tüm soruları doğru yanıtladın!';sb.style.color='#2e7d32';}
    else if(pct>=70){sb.textContent='👍 Başarılı! '+cor+'/'+TQ.length+' doğru (%'+pct+')';sb.style.color='#1565c0';}
    else{sb.textContent='📚 '+cor+'/'+TQ.length+' doğru (%'+pct+'). Konuları tekrar incele.';sb.style.color='#c62828';}
  });
  if(trst) trst.addEventListener('click', function(){
    document.querySelectorAll('#tsorular label').forEach(function(l){l.style.background='';});
    document.querySelectorAll('#tsorular input').forEach(function(r){r.checked=false;});
    document.getElementById('tsonuc').textContent='';
  });
}


// ── COLLAPSIBLE NAV ──
document.querySelectorAll('.nav-bolum-toggle').forEach(function(el) {
  el.addEventListener('click', function() {
    var bolum = this.dataset.bolum;
    var icerik = document.getElementById('n' + bolum);
    var ok = this.querySelector('.nav-bolum-ok');
    if (!icerik) return;
    if (icerik.classList.contains('kapali')) {
      icerik.classList.remove('kapali');
      if (ok) ok.textContent = '▼';
    } else {
      icerik.classList.add('kapali');
      if (ok) ok.textContent = '▶';
    }
  });
});

// ── SAYFA GÖSTER ──
function sayfaGoster(id) {
  if (!ICERIK[id]) return;
  aktifSayfa = id;
  document.getElementById('icerik').innerHTML = ICERIK[id].html;
  document.querySelectorAll('.nav-item[data-sayfa]').forEach(function(el) {
    el.classList.toggle('aktif', el.dataset.sayfa === id);
  });
  // Aktif sayfanın bölümünü aç
  var bolumId = id.startsWith('b1') ? 'nb1' : id.startsWith('b2') ? 'nb2' : id.startsWith('b3') ? 'nb3' : null;
  if (bolumId) {
    var icerik = document.getElementById(bolumId);
    if (icerik && icerik.classList.contains('kapali')) {
      icerik.classList.remove('kapali');
      var toggle = document.querySelector('[data-bolum="'+bolumId.replace('n','')+'"] .nav-bolum-ok');
      if (toggle) toggle.textContent = '▼';
    }
  }
  document.getElementById('bread').textContent = ICERIK[id].baslik;
  var idx = SAYFALAR.indexOf(id);
  var pct = Math.round((idx + 1) / SAYFALAR.length * 100);
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-text').textContent = '%' + pct;
  document.getElementById('sayfa-no').textContent = (idx+1) + ' / ' + SAYFALAR.length;
  window.scrollTo(0, 0);
  var initKey = ICERIK[id].initKey;
  if (initKey === 'harita') initHarita();
  else if (initKey === 'bulmaca') initBulmaca();
  else if (initKey === 'test') initTest();
  else if (initKey === 'infografik') loadMedia();
  else if (initKey === 'b2test') initB2Test();
  else if (initKey === 'b2bulmaca') initB2Bulmaca();
  initDW();
  initPopups();
  initH3Etiketler();
  document.getElementById('sidebar').classList.remove('acik');
  document.getElementById('overlay').classList.remove('aktif');
}

document.querySelectorAll('.nav-item[data-sayfa]').forEach(function(el) {
  el.addEventListener('click', function() { sayfaGoster(this.dataset.sayfa); });
});
document.getElementById('btn-onceki').addEventListener('click', function() {
  var idx = SAYFALAR.indexOf(aktifSayfa);
  if (idx > 0) sayfaGoster(SAYFALAR[idx-1]);
});
document.getElementById('btn-sonraki').addEventListener('click', function() {
  var idx = SAYFALAR.indexOf(aktifSayfa);
  if (idx < SAYFALAR.length-1) sayfaGoster(SAYFALAR[idx+1]);
});
document.getElementById('menu-toggle').addEventListener('click', function() {
  document.getElementById('sidebar').classList.toggle('acik');
  document.getElementById('overlay').classList.toggle('aktif');
});
document.getElementById('overlay').addEventListener('click', function() {
  document.getElementById('sidebar').classList.remove('acik');
  this.classList.remove('aktif');
});
sayfaGoster('giris');


// ── KAVRAM BULUTU HOVER POPUP ──
(function(){
  var popup = document.createElement('div');
  popup.id = 'bk-popup';
  popup.style.cssText = 'position:fixed;display:none;z-index:9999;max-width:280px;' +
    'background:#1a1a2e;color:#e8eaf0;border-radius:10px;padding:14px 16px;' +
    'font-family:"Source Serif 4",Georgia,serif;font-size:.82rem;line-height:1.65;' +
    'box-shadow:0 8px 32px rgba(0,0,0,.4);pointer-events:none;border-top:3px solid #c8a84b;';
  document.body.appendChild(popup);

  var mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', function(e){ mouseX=e.clientX; mouseY=e.clientY; });

  function showPopup(el) {
    var tanim = el.getAttribute('data-tanim');
    var kavram = el.textContent.trim();
    var renk = el.getAttribute('fill') || '#c8a84b';
    if (!tanim || !kavram) return;

    popup.innerHTML =
      '<div style="font-family:monospace;font-size:.67rem;font-weight:700;letter-spacing:.09em;' +
      'text-transform:uppercase;color:' + renk + ';margin-bottom:8px">' + kavram + '</div>' +
      '<div style="color:#d0d4e8">' + tanim + '</div>';

    popup.style.borderTopColor = renk;
    popup.style.display = 'block';
    posPopup();
  }

  function posPopup() {
    var pw = popup.offsetWidth || 280;
    var ph = popup.offsetHeight || 120;
    var x = mouseX + 14;
    var y = mouseY - 10;
    if (x + pw > window.innerWidth - 16) x = mouseX - pw - 14;
    if (y + ph > window.innerHeight - 16) y = mouseY - ph - 10;
    if (y < 8) y = 8;
    popup.style.left = x + 'px';
    popup.style.top  = y + 'px';
  }

  // SVG text elementleri için event delegation — mouseover/mouseout
  document.addEventListener('mouseover', function(e) {
    var el = e.target;
    if (el.tagName === 'text' && el.classList.contains('bk')) {
      showPopup(el);
    }
  });

  document.addEventListener('mouseout', function(e) {
    var el = e.target;
    if (el.tagName === 'text' && el.classList.contains('bk')) {
      popup.style.display = 'none';
    }
  });

  // Popup'u mouse ile takip ettir
  document.addEventListener('mousemove', function(e) {
    if (popup.style.display === 'block') posPopup();
  });
})();

// ── H3 ETIKET SİSTEMİ ──
// h3.a-baslik'lara başlığa göre renkli küçük etiket ekle
function initH3Etiketler() {
  var etiketMap = {
    'Tanım':                   { label: 'TANIM',          color: '#1565c0', bg: '#e8f0fe' },
    'Açıklama':                { label: 'AÇIKLAMA',       color: '#2e7d32', bg: '#f1f8f2' },
    'Temel Özellikler':        { label: 'ÖZELLİKLER',     color: '#e65100', bg: '#fff3e0' },
    'Genel Sınıflandırma Şeması': { label: 'ŞEMA',        color: '#6a1b9a', bg: '#f9f0ff' },
    'Karşılaştırma Tablosu':   { label: 'TABLO',          color: '#c77800', bg: '#fff8e8' },
    'Tablo':                   { label: 'TABLO',          color: '#c77800', bg: '#fff8e8' },
    'İnfografik':              { label: 'GRAFIK',         color: '#00838f', bg: '#e0f7fa' },
  };

  document.querySelectorAll('h3.a-baslik').forEach(function(el) {
    if (el.querySelector('.h3-etiket')) return; // Zaten ekli
    var text = el.textContent.trim();
    
    // Eşleşme bul
    var match = null;
    Object.keys(etiketMap).forEach(function(key) {
      if (text.startsWith(key) || text.includes(key)) {
        if (!match) match = etiketMap[key];
      }
    });
    
    // Alt bölüm numarası (2.1.1, 2.2.1 vb.)
    if (!match && /^\d+\.\d+\.\d*/.test(text)) {
      match = { label: 'BÖLÜM', color: '#0d1b6e', bg: '#e8eaf6' };
    }
    
    if (match) {
      var etiket = document.createElement('span');
      etiket.className = 'h3-etiket';
      etiket.textContent = match.label;
      etiket.style.cssText = [
        'display:inline-block',
        'font-family:\'JetBrains Mono\',monospace',
        'font-size:.6rem',
        'font-weight:700',
        'letter-spacing:.14em',
        'text-transform:uppercase',
        'color:' + match.color,
        'background:' + match.bg,
        'border:1px solid ' + match.color + '44',
        'border-radius:4px',
        'padding:2px 8px',
        'margin-right:10px',
        'vertical-align:middle',
        'position:relative',
        'top:-1px',
      ].join(';');
      el.insertBefore(etiket, el.firstChild);
      // Sadece tam eşleşen basit başlıklarda metin gizle — bölüm numarası içerenlere dokunma
      var hideLabels = ['Tanım','Açıklama','Temel Özellikler','Temel Kavramlar','Genel Bakış'];
      var isSimpleLabel = hideLabels.indexOf(text) !== -1;
      if (isSimpleLabel) {
        el.childNodes.forEach(function(node) {
          if (node.nodeType === 3) { node.textContent = ''; }
        });
      }
    }
  });
}

// Sayfa yüklendiğinde ve her sayfa değişiminde çalıştır
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initH3Etiketler);
} else {
  initH3Etiketler();
}
// İçerik değiştiğinde etiketi yeniden uygula
var _h3Observer = new MutationObserver(function() {
  initH3Etiketler();
});
_h3Observer.observe(document.getElementById('icerik') || document.body, {childList: true, subtree: false});


// ── BÖLÜM II TEST ──
function initB2Test() {
  var TQ=[
    {s:"Pavlov'un köpeklerle yaptığı deneyin öğrenme kuramındaki karşılığı hangisidir?",o:["Edimsel koşullanma","Klasik koşullanma","Bilişsel harita","Model alma"],d:1,k:"Kuram"},
    {s:"Vygotsky'nin ZPD kavramına göre en verimli öğretim nerede gerçekleşir?",o:["Öğrencinin rahatça yaptığı görevlerde","Öğrencinin destekle yapabildiği alanda","Öğrencinin hiç bilemeyeceği konularda","Sınıf ortalamasının üzerinde"],d:1,k:"Kuram"},
    {s:"Ausubel'in anlamlı öğrenme kuramına göre yeni bilgi nasıl öğrenilir?",o:["Tekrar yoluyla","Ödül-ceza döngüsüyle","Önceki bilgi yapılarıyla ilişkilendirilerek","Gözlem yoluyla taklit edilerek"],d:2,k:"Kuram"},
    {s:"Aşağıdakilerden hangisi yapılandırmacı kuramın temel özelliği DEĞİLDİR?",o:["Bilgi öğrenci tarafından inşa edilir","Öğrenme sosyal etkileşimle zenginleşir","Bilgi doğrudan aktarılabilir","Ön bilgiler yeni öğrenmeyi etkiler"],d:2,k:"Kuram"},
    {s:"Bandura'nın model alma kavramı hangi öğrenme yaklaşımı içinde yer alır?",o:["Davranışçı","Bilişsel","Sosyal Bilişsel","Hümanistik"],d:2,k:"Yaklaşım"},
    {s:"Bloom taksonomisi hangi öğrenme yaklaşımıyla temel olarak ilişkilidir?",o:["Hümanistik","Yapılandırmacı","Davranışçı–Bilişsel","Sosyal Bilişsel"],d:2,k:"Yaklaşım"},
    {s:"Yapılandırmacı yaklaşımda öğretmenin rolü nasıl tanımlanır?",o:["Bilgi aktarıcısı","Rehber ve kolaylaştırıcı","Otorite","Değerlendirici"],d:1,k:"Yaklaşım"},
    {s:"Gagné'nin Öğretimin 9 Olayı modeli hangi stratejiyle en uyumludur?",o:["Deneyim","Aktarım","Sorgulama","Yerinde öğretim"],d:1,k:"Model"},
    {s:"ASSURE modeli öncelikli olarak hangi amaçla kullanılır?",o:["Öğrenme güçlüklerini teşhis etmek","Medya ve materyal seçimi için ders planlamak","Öğrenci değerlendirmesi yapmak","Müfredat geliştirmek"],d:1,k:"Model"},
    {s:"Aşağıdakilerden hangisi sorgulama stratejisinin yöntemi DEĞİLDİR?",o:["Problem çözme","Proje yöntemi","Anlatım yöntemi","Drama yöntemi"],d:2,k:"Strateji"},
    {s:"Jigsaw, Think-Pair-Share ve kartopu teknikleri hangi stratejinin yöntemine aittir?",o:["Aktarım – Anlatım","Etkileşim – İşbirlikli Öğretim","Sorgulama – Proje","Deneyim – Drama"],d:1,k:"Strateji"},
    {s:"Öğrencinin gerçek ortamlarda gözlem ve alan notu tutarak öğrendiği strateji hangisidir?",o:["Bireysel öğretim","Aktarım","Sorgulama","Yerinde öğretim"],d:3,k:"Strateji"},
    {s:"Aşağıdakilerden hangisi bir yöntem değil, tekniktir?",o:["Tartışma","Proje","Münazara","Simülasyon"],d:2,k:"Yöntem-Teknik"},
    {s:"Gösterip-yaptırma yöntemi en çok hangi tür kazanımlar için uygundur?",o:["Tutum ve değer","Beceri ve prosedür","Kavrama ve analiz","Yaratıcılık ve sentez"],d:1,k:"Yöntem-Teknik"},
    {s:"Balık kılçığı diyagramı hangi yöntemin tekniğidir?",o:["Drama","İşbirlikli öğretim","Problem çözme","Gezi"],d:2,k:"Yöntem-Teknik"},
    {s:"'Bilinenden bilinmeyene' ilkesi hangi kuramcıyla ilişkilidir?",o:["Piaget","Vygotsky","Ausubel","Skinner"],d:2,k:"İlke"},
    {s:"'Somuttan soyuta' öğretim ilkesinin psikolojik temeli nedir?",o:["Davranışçı pekiştirme","Piaget'nin bilişsel gelişim evreleri","Vygotsky'nin ZPD","Bandura'nın öz-yeterliği"],d:1,k:"İlke"},
    {s:"Aşağıdakilerden hangisi bir öğrenme ilkesidir?",o:["Açıklık ilkesi","Ekonomiklik ilkesi","Yürütücü biliş ilkesi","Hedef ilkesi"],d:2,k:"İlke"},
    {s:"Bütünlük ilkesinin öncüsü olarak kabul edilen eğitimci kimdir?",o:["Dewey","Kerschensteiner","Comenius","Ausubel"],d:1,k:"İlke"},
    {s:"VARK modelinde K neyi temsil eder?",o:["Kavramsal","Kinestetik","Karmaşık","Kritik"],d:1,k:"Bireysel Farklılıklar"},
    {s:"Gardner'ın çoklu zekâ kuramında doğacı zekâ neyle ilişkilidir?",o:["Müzik ve ritim","Empati ve sosyal algı","Doğal dünyayı tanıma ve sınıflama","Sayılar ve örüntüler"],d:2,k:"Bireysel Farklılıklar"},
    {s:"Carol Dweck'in sabit zihniyet kavramı neyi ifade eder?",o:["Zekânın çalışmayla gelişeceği","Başarısızlığın öğrenme fırsatı olduğu","Zekânın doğuştan belirlenip değişmediği","Motivasyonun dışsal kaynaklardan geldiği"],d:2,k:"Bireysel Farklılıklar"},
    {s:"Deci ve Ryan'ın öz-belirleme kuramına göre içsel motivasyonun üç bileşeni nedir?",o:["Ödül, ceza, geri bildirim","Yetkinlik, özerklik, ilişkisellik","Dikkat, tekrar, anlamlandırma","Hedef, içerik, değerlendirme"],d:1,k:"Bireysel Farklılıklar"},
    {s:"Dunn & Dunn modelinde kaç uyaran alanı tanımlanmıştır?",o:["3","4","5","6"],d:2,k:"Bireysel Farklılıklar"},
    {s:"Shulman'ın PAB kavramı neyi ifade eder?",o:["Bir konuyu derin bilmek","Genel öğretim yöntemlerine hâkim olmak","Alan bilgisi ile pedagojinin kesişimindeki öğretime özgü bilgi","Öğrenci farklılıklarını bilmek"],d:2,k:"Yöntem Seçimi"},
    {s:"40 kişilik bir sınıfta uygulanması en güç yöntem hangisidir?",o:["Anlatım","Soru-cevap","Küçük grup drama","Gösteri"],d:2,k:"Yöntem Seçimi"},
    {s:"Bloom'a göre yaratma basamağına en uygun yöntem hangisidir?",o:["Anlatım","Soru-cevap","Proje yöntemi","Gösteri"],d:2,k:"Yöntem Seçimi"},
    {s:"Hangi faktör yöntem seçiminde Bloom basamağını doğrudan belirler?",o:["Fiziki ortam","Zaman","Hedef ve içerik","Sınıf büyüklüğü"],d:2,k:"Yöntem Seçimi"},
    {s:"Aşağıdakilerden hangisi etkileşim stratejisinin yöntemlerinden biridir?",o:["Anlatım","Gezi","İşbirlikli öğretim","Modüler öğretim"],d:2,k:"Strateji"},
    {s:"Skinner'ın edimsel koşullanma kuramında pekiştirme takvimi neyi ifade eder?",o:["Ödüllerin hangi aralıklarla verileceği plan","Ceza türlerinin sıralaması","Öğrenme hedeflerinin düzeni","Sınıf kuralları listesi"],d:0,k:"Kuram"}
  ];
  var tw=document.getElementById('b2test-sorular');
  if(!tw) return;
  TQ.forEach(function(q,qi){
    var div=document.createElement('div');
    div.id='b2ts'+qi;
    div.style.cssText='background:#fff;border:1.5px solid #e3e8f0;border-radius:12px;padding:16px 18px;margin-bottom:14px;transition:border-color .2s';
    var lbl=document.createElement('div');
    lbl.style.cssText='font-size:.72rem;font-weight:700;color:#9ca3af;letter-spacing:.08em;margin-bottom:6px;text-transform:uppercase';
    lbl.textContent='Soru '+(qi+1)+' · '+q.k;
    var st=document.createElement('div');
    st.style.cssText='font-size:.92rem;font-weight:600;margin-bottom:10px;line-height:1.6;color:#1a237e';
    st.textContent=q.s;
    div.appendChild(lbl); div.appendChild(st);
    q.o.forEach(function(opt,oi){
      var lbl2=document.createElement('label');
      lbl2.style.cssText='display:block;padding:7px 11px;border-radius:8px;cursor:pointer;font-size:.88rem;color:#374151;margin-bottom:5px;border:1.5px solid #e5e7eb;transition:background .15s';
      var inp=document.createElement('input');
      inp.type='radio'; inp.name='b2q'+qi; inp.value=oi;
      inp.style.marginRight='8px';
      lbl2.appendChild(inp); lbl2.appendChild(document.createTextNode(opt));
      div.appendChild(lbl2);
    });
    var ac=document.createElement('div');
    ac.id='b2ac'+qi;
    ac.style.cssText='display:none;margin-top:10px;padding:10px 14px;border-radius:8px;font-size:.85rem;line-height:1.65';
    div.appendChild(ac);
    tw.appendChild(div);
  });
  var chk=document.getElementById('b2test-chk'), rst=document.getElementById('b2test-rst');
  if(chk) chk.addEventListener('click', function(){
    var puan=0;
    TQ.forEach(function(q,qi){
      var sec=document.querySelector('input[name="b2q'+qi+'"]:checked');
      var ac=document.getElementById('b2ac'+qi);
      var kart=document.getElementById('b2ts'+qi);
      if(!sec){ac.style.display='block';ac.style.background='#fef3c7';ac.innerHTML='⚠️ Bu soruyu yanıtlamadınız.';return;}
      var val=parseInt(sec.value);
      ac.style.display='block';
      if(val===q.d){puan++;kart.style.borderColor='#34d399';ac.style.background='#d1fae5';ac.innerHTML='✅ <strong>Doğru!</strong>';}
      else{kart.style.borderColor='#f87171';ac.style.background='#fee2e2';ac.innerHTML='❌ <strong>Yanlış.</strong> Doğru cevap: <em>'+q.o[q.d]+'</em>';}
    });
    var sonuc=document.getElementById('b2test-sonuc');
    sonuc.style.display='block';
    var pct=Math.round(puan/TQ.length*100);
    var renk=pct>=70?'#059669':pct>=50?'#d97706':'#dc2626';
    sonuc.innerHTML='<div style="text-align:center;padding:20px;background:'+renk+'22;border:2px solid '+renk+';border-radius:12px"><div style="font-size:2.2rem;font-weight:800;color:'+renk+'">'+puan+' / '+TQ.length+'</div><div style="font-size:1.1rem;color:'+renk+';font-weight:600;margin-top:4px">%'+pct+'</div><div style="margin-top:8px;font-size:.9rem;color:#374151">'+(pct>=70?'🎉 Tebrikler! Bölüm II\'yi iyi öğrendiniz.':pct>=50?'👍 İyi! Bazı konuları gözden geçirebilirsiniz.':'📚 Bölüm II\'yi tekrar okumanızı öneririz.')+'</div></div>';
    sonuc.scrollIntoView({behavior:'smooth',block:'nearest'});
  });
  if(rst) rst.addEventListener('click', function(){
    document.querySelectorAll('[name^="b2q"]').forEach(function(r){r.checked=false;});
    document.querySelectorAll('[id^="b2ac"]').forEach(function(a){a.style.display='none';});
    document.querySelectorAll('[id^="b2ts"]').forEach(function(k){k.style.borderColor='#e3e8f0';});
    document.getElementById('b2test-sonuc').style.display='none';
  });
}

// ── BÖLÜM II BULMACA ──
function initB2Bulmaca() {
  var ANSWER=[
    "PEKISTIRME######",
    "#Y###M##########",
    "#OK##O##########",
    "#NU##D##########",
    "STRATEJI########",
    "#EA##L#L########",
    "#MM#VARK#D######",
    "#######E#E######",
    "YAKLASIM#W######",
    "#U#######E######",
    "#S##PIAGETY#####",
    "#U##############",
    "#B#BLOOM########",
    "#E##############",
    "#L#TEKNIK#######",
    "################",
    "MOTIVASYON######"
  ];
  var WORDS=[
    [1,'across',0,0,'PEKISTIRME','Davranışçılıkta istendik davranışı güçlendiren süreç (10 harf)'],
    [2,'down',1,1,'YONTEM','Strateji ile teknik arasındaki köprü'],
    [3,'down',1,5,'MODEL','Kuramın öğretim uygulamasına rehberlik eden yapılandırılmış çerçeve'],
    [4,'down',2,2,'KURAM','Öğrenme ve öğretim süreçlerini açıklayan sistematik bilgi bütünü'],
    [5,'across',4,0,'STRATEJI','Öğretimde genel yönelimi belirleyen en üst karar (8 harf)'],
    [6,'down',4,7,'ILKE','Öğretim kararlarına rehberlik eden temel düşünce'],
    [7,'across',6,4,'VARK','Fleming\'in öğrenme stili modeli (kısaltma, 4 harf)'],
    [8,'down',6,9,'DEWEY','Yaparak yaşayarak öğrenmenin öncüsü'],
    [9,'across',8,0,'YAKLASIM','Kuramsal varsayımlardan üretilen bakış açısı (8 harf)'],
    [10,'down',8,1,'AUSUBEL','Anlamlı öğrenme kuramının kurucusu (7 harf)'],
    [11,'across',10,3,'PIAGET','Bilişsel gelişim evrelerini tanımlayan psikolog (6 harf)'],
    [12,'across',12,3,'BLOOM','Öğrenme hedefleri taksonomisini geliştiren eğitimci'],
    [13,'across',14,3,'TEKNIK','Yöntemi hayata geçiren somut uygulama adımı (6 harf)'],
    [14,'across',16,0,'MOTIVASYON','Davranışı başlatan, yönlendiren ve sürdüren güç (10 harf)']
  ];
  var ROWS=ANSWER.length, COLS=ANSWER[0].length;
  var cellNum={}, cells={}, selR=-1, selC=-1, selDir='across';
  WORDS.forEach(function(w){var k=w[2]+','+w[3];if(!cellNum[k])cellNum[k]=w[0];});
  var tbl=document.getElementById('b2tbl');
  if(!tbl) return;
  tbl.style.cssText='border-collapse:collapse;table-layout:fixed;width:auto;';
  for(var r=0;r<ROWS;r++){
    var tr=document.createElement('tr');
    for(var c=0;c<COLS;c++){
      var td=document.createElement('td'), ch=ANSWER[r][c];
      td.style.cssText='width:34px;height:34px;min-width:34px;min-height:34px;padding:0;position:relative;';
      if(ch==='#'){td.style.background='#2c3e6b';}
      else{
        td.style.background='#f8fafc';td.style.border='1px solid #c5d0de';
        var k2=r+','+c;
        if(cellNum[k2]){
          var sp=document.createElement('span');
          sp.style.cssText='position:absolute;top:1px;left:2px;font-size:14px;font-weight:800;color:#1565c0;line-height:1;pointer-events:none;z-index:1;';
          sp.textContent=cellNum[k2]; td.appendChild(sp);
        }
        var inp=document.createElement('input');
        inp.style.cssText='width:100%;height:100%;border:none;background:transparent;text-align:center;font-size:15px;font-weight:700;color:#1a2b5e;text-transform:uppercase;outline:none;cursor:pointer;padding:0;caret-color:transparent;position:relative;z-index:2;';
        inp.maxLength=1; inp.setAttribute('data-r',r); inp.setAttribute('data-c',c);
        inp.addEventListener('keydown', b2Key);
        inp.addEventListener('click',function(){b2Sel(+this.getAttribute('data-r'),+this.getAttribute('data-c'),true);});
        inp.addEventListener('input',function(){
          var v=this.value.replace(/[^a-zA-Z\u011f\u00fc\u015f\u00f6\u00e7\u0131\u011e\u00dc\u015e\u00d6\u00c7\u0130]/g,'');
          this.value=v?v[v.length-1].toUpperCase():'';
          if(this.value) b2MvNext(+this.getAttribute('data-r'),+this.getAttribute('data-c'));
        });
        td.appendChild(inp); cells[k2]=td;
      }
      tr.appendChild(td);
    }
    tbl.appendChild(tr);
  }
  function b2Gw(r,c,d){
    for(var i=0;i<WORDS.length;i++){
      var w=WORDS[i];if(w[1]!==d)continue;
      var wr=w[2],wc=w[3],wl=w[4];
      if(d==='across'){if(r===wr&&c>=wc&&c<wc+wl.length)return w;}
      else{if(c===wc&&r>=wr&&r<wr+wl.length)return w;}
    }
    return null;
  }
  function b2Hl(){
    Object.keys(cells).forEach(function(k){cells[k].style.background='#f8fafc';});
    if(selR<0)return;
    var w=b2Gw(selR,selC,selDir);if(!w)return;
    for(var i=0;i<w[4].length;i++){
      var r2=w[2],c2=w[3];
      if(w[1]==='across')c2+=i;else r2+=i;
      var td=cells[r2+','+c2];if(td)td.style.background='#e8f4fd';
    }
    var s=cells[selR+','+selC];if(s)s.style.background='#cde4fa';
  }
  function b2Sel(r,c,tog){
    if(r===selR&&c===selC&&tog){var ot=selDir==='across'?'down':'across';if(b2Gw(r,c,ot))selDir=ot;}
    if(!b2Gw(r,c,selDir))selDir=selDir==='across'?'down':'across';
    selR=r;selC=c;b2Hl();b2UpdCl();
    var inp=cells[r+','+c]&&cells[r+','+c].querySelector('input');if(inp)inp.focus();
  }
  function b2MvNext(r,c){
    var w=b2Gw(r,c,selDir);if(!w)return;
    var nr=-1,nc=-1;
    if(selDir==='across'){if(c+1<w[3]+w[4].length){nr=r;nc=c+1;}}
    else{if(r+1<w[2]+w[4].length){nr=r+1;nc=c;}}
    if(nr>=0)b2Sel(nr,nc,false);
  }
  function b2Norm(s){return s.toUpperCase().replace(/[\u0130I]/g,'I').replace(/[\u011e\u011f]/g,'G').replace(/[\u015e\u015f]/g,'S').replace(/[\u00dc\u00fc]/g,'U').replace(/[\u00d6\u00f6]/g,'O').replace(/[\u00c7\u00e7]/g,'C').replace(/\u0131/g,'I');}
  function b2Key(e){
    var r=+this.getAttribute('data-r'),c=+this.getAttribute('data-c');
    if(e.key==='ArrowRight'){e.preventDefault();if(cells[r+','+(c+1)])b2Sel(r,c+1,false);}
    else if(e.key==='ArrowLeft'){e.preventDefault();if(cells[r+','+(c-1)])b2Sel(r,c-1,false);}
    else if(e.key==='ArrowDown'){e.preventDefault();if(cells[(r+1)+','+c])b2Sel(r+1,c,false);}
    else if(e.key==='ArrowUp'){e.preventDefault();if(cells[(r-1)+','+c])b2Sel(r-1,c,false);}
    else if(e.key==='Backspace'&&!this.value){
      if(selDir==='across'&&c>0&&cells[r+','+(c-1)]){b2Sel(r,c-1,false);var pi=cells[r+','+(c-1)].querySelector('input');if(pi)pi.value='';}
      else if(selDir==='down'&&r>0&&cells[(r-1)+','+c]){b2Sel(r-1,c,false);var pi2=cells[(r-1)+','+c].querySelector('input');if(pi2)pi2.value='';}
    }
  }
  var chk=document.getElementById('b2b-chk'),rev=document.getElementById('b2b-rev'),rst=document.getElementById('b2b-rst');
  if(chk) chk.addEventListener('click',function(){
    var tot=0,cor=0;
    for(var r=0;r<ROWS;r++)for(var c=0;c<COLS;c++){
      if(ANSWER[r][c]==='#')continue;tot++;
      var td=cells[r+','+c];if(!td)continue;
      var inp=td.querySelector('input');if(!inp||!inp.value){td.style.background='#f8fafc';continue;}
      if(b2Norm(inp.value)===ANSWER[r][c]){td.style.background='#c8efd4';cor++;}
      else td.style.background='#fdd';
    }
    var sb=document.getElementById('b2score-box');
    if(sb){var pct=Math.round(cor/tot*100);sb.innerHTML=cor+' / '+tot+' harf doğru — %'+pct;sb.style.color=pct===100?'#059669':'#1565c0';}
  });
  if(rev) rev.addEventListener('click',function(){
    for(var r=0;r<ROWS;r++)for(var c=0;c<COLS;c++){
      if(ANSWER[r][c]==='#')continue;
      var td=cells[r+','+c];if(!td)continue;
      var inp=td.querySelector('input');if(inp)inp.value=ANSWER[r][c];
      td.style.background='#fef9c3';
    }
    var sb=document.getElementById('b2score-box');if(sb){sb.textContent='Tüm cevaplar gösterildi.';sb.style.color='#6a1b9a';}
  });
  if(rst) rst.addEventListener('click',function(){
    for(var r=0;r<ROWS;r++)for(var c=0;c<COLS;c++){
      if(ANSWER[r][c]==='#')continue;
      var td=cells[r+','+c];if(!td)continue;
      var inp=td.querySelector('input');if(inp)inp.value='';
      td.style.background='#f8fafc';
    }
    var sb=document.getElementById('b2score-box');if(sb)sb.textContent='';
    selR=-1;selC=-1;
  });
  // İpuçları listesi
  var acr=[],dwn=[],seen={};
  WORDS.forEach(function(w){var k=w[0]+w[1];if(seen[k])return;seen[k]=1;if(w[1]==='across')acr.push(w);else dwn.push(w);});
  function mkList(items,cid){
    var el=document.getElementById(cid);if(!el)return;
    items.forEach(function(w){
      var d=document.createElement('div');
      d.id='b2clue-'+w[0]+'-'+w[1];
      d.style.cssText='padding:5px 0;border-bottom:1px solid #f0f0f0;cursor:pointer;display:flex;gap:6px;align-items:flex-start';
      d.innerHTML='<span style="font-weight:800;color:#0d1b6e;min-width:22px;font-size:.82rem">'+w[0]+'.</span><span style="color:#374151;font-size:.82rem;line-height:1.45">'+w[5]+'</span>';
      d.addEventListener('click',function(){
        selDir=w[1];b2Sel(w[2],w[3],false);
        // inp.scrollIntoView kaldırıldı — preventScroll:true focus yeterli
      });
      el.appendChild(d);
    });
  }
  mkList(acr,'b2across-list');mkList(dwn,'b2down-list');
  function b2UpdCl(){
    document.querySelectorAll('[id^="b2clue-"]').forEach(function(el){el.style.background='';});
    var w=b2Gw(selR,selC,selDir);if(!w)return;
    var el=document.getElementById('b2clue-'+w[0]+'-'+w[1]);
    if(el){
      el.style.background='#e8f4fd';
      var container2=el.closest('[id$="-list"]');
      if(container2){
        var top2=el.offsetTop-container2.offsetTop-container2.clientHeight/2+el.clientHeight/2;
        container2.scrollTop=Math.max(0,top2);
      }
    }
  }
}
