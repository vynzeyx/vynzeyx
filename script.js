// =========================================================================
// LOGIKA APLIKASI WEB SOCIAL MEDIA BIO LINK
// =========================================================================

document.addEventListener("DOMContentLoaded", () => {
  renderProfile();
  renderQuickSocials();
  renderFeaturedLink();
  renderLinks();
  initTheme();
  setupEvents();

  // Initialize Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }
});

// 1. Render Informasi Profil
function renderProfile() {
  const avatar = document.getElementById("profileAvatar");
  const name = document.getElementById("profileName");
  const handle = document.getElementById("profileHandle");
  const status = document.getElementById("profileStatus");
  const bio = document.getElementById("profileBio");
  const footerName = document.getElementById("footerName");
  const currentYear = document.getElementById("currentYear");
  const emailDirectBtn = document.getElementById("emailDirectBtn");

  if (avatar) avatar.src = profileData.avatar || "avatar.jpg";
  if (name) name.textContent = profileData.name;
  if (handle) handle.textContent = profileData.handle;
  if (status) status.textContent = profileData.status;
  if (bio) bio.textContent = profileData.bio;
  if (footerName) footerName.textContent = profileData.name;
  if (currentYear) currentYear.textContent = new Date().getFullYear();
  if (emailDirectBtn && profileData.email) {
    emailDirectBtn.href = `mailto:${profileData.email}`;
  }
}

// 2. Render Icon Sosial Cepat
function renderQuickSocials() {
  const container = document.getElementById("quickSocials");
  if (!container) return;
  if (!profileData.quickSocials || profileData.quickSocials.length === 0) {
    container.innerHTML = "";
    container.classList.add("hidden");
    return;
  }
  container.classList.remove("hidden");
  container.innerHTML = "";
  profileData.quickSocials.forEach((social) => {
    const a = document.createElement("a");
    a.href = social.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.title = social.name;
    a.className = `quick-social-btn ${social.colorClass || ""}`;
    if (social.iconImg) {
      a.innerHTML = `<img src="${social.iconImg}" alt="${social.name}" class="w-6 h-6 object-cover rounded-full">`;
    } else {
      a.innerHTML = `<i class="${social.iconClass} text-lg"></i>`;
    }
    container.appendChild(a);
  });
}

// 3. Render Link Unggulan / Featured
function renderFeaturedLink() {
  const container = document.getElementById("featuredLinkContainer");
  if (!container) return;
  if (!profileData.featuredLink) {
    container.innerHTML = "";
    container.classList.add("hidden");
    return;
  }
  container.classList.remove("hidden");

  const item = profileData.featuredLink;
  container.innerHTML = `
    <a href="${item.url}" target="_blank" rel="noopener noreferrer" 
       class="relative block p-4 rounded-2xl bg-gradient-to-r ${item.themeGradient || "from-indigo-600 via-purple-600 to-pink-600"} text-white shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 group overflow-hidden">
      
      <!-- Shimmer decorative glow -->
      <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      <div class="flex items-center justify-between gap-3 relative z-10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-lg flex-shrink-0 group-hover:rotate-6 transition-transform">
            <i class="${item.iconClass || 'fa-solid fa-star'}"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="font-bold text-sm sm:text-base leading-tight">${item.title}</h2>
              ${item.badge ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-white text-indigo-700 shadow-sm">${item.badge}</span>` : ""}
            </div>
            <p class="text-xs text-white/80 mt-0.5 line-clamp-1">${item.subtitle || ""}</p>
          </div>
        </div>
        <div class="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 group-hover:translate-x-1 transition-transform">
          <i data-lucide="arrow-up-right" class="w-4 h-4"></i>
        </div>
      </div>
    </a>
  `;
}

// Helper: Hapus background gambar jadi transparan menggunakan Canvas
function getTransparentIcon(src, callback) {
  const cacheKey = "trans_icon_v1_" + src;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    callback(cached);
    return;
  }

  const img = new Image();
  img.src = src;
  img.onload = () => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imgData.data;
      const w = canvas.width;
      const h = canvas.height;

      const visited = new Uint8Array(w * h);
      const queue = [];

      for (let x = 0; x < w; x++) {
        queue.push(x, 0, x, h - 1);
        visited[x] = 1;
        visited[(h - 1) * w + x] = 1;
      }
      for (let y = 0; y < h; y++) {
        queue.push(0, y, w - 1, y);
        visited[y * w] = 1;
        visited[y * w + (w - 1)] = 1;
      }

      let head = 0;
      while (head < queue.length) {
        const cx = queue[head++];
        const cy = queue[head++];
        const idx = (cy * w + cx) * 4;

        const r = d[idx];
        const g = d[idx + 1];
        const b = d[idx + 2];

        // WhatsApp green boundary
        const isGreen = (g > r + 30 && g > b + 30);
        if (isGreen) continue;

        d[idx + 3] = 0; // Set Alpha = 0 (transparan)

        const neighbors = [
          [cx + 1, cy],
          [cx - 1, cy],
          [cx, cy + 1],
          [cx, cy - 1]
        ];
        for (let i = 0; i < 4; i++) {
          const nx = neighbors[i][0];
          const ny = neighbors[i][1];
          if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
            const nPos = ny * w + nx;
            if (!visited[nPos]) {
              visited[nPos] = 1;
              const nIdx = nPos * 4;
              const ng = d[nIdx + 1];
              const nr = d[nIdx];
              const nb = d[nIdx + 2];
              if (!(ng > nr + 30 && ng > nb + 30)) {
                queue.push(nx, ny);
              }
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const dataUrl = canvas.toDataURL("image/png");
      try {
        localStorage.setItem(cacheKey, dataUrl);
      } catch (e) { }
      callback(dataUrl);
    } catch (e) {
      callback(src);
    }
  };
  img.onerror = () => callback(src);
}

// 4. Render Daftar Link
function renderLinks() {
  const container = document.getElementById("linksList");
  if (!container || !profileData.links) return;

  container.innerHTML = "";
  profileData.links.forEach((link, index) => {
    const a = document.createElement("a");
    a.href = link.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.className = "link-card group animate-fade-in";
    a.style.animationDelay = `${index * 60}ms`;

    let iconContent = "";
    if (link.iconImg) {
      if (link.transparent) {
        const imgId = `link-icon-${index}`;
        iconContent = `<img id="${imgId}" src="${link.iconImg}" alt="${link.title}" class="w-7 h-7 object-contain">`;
        setTimeout(() => {
          getTransparentIcon(link.iconImg, (cleanSrc) => {
            const el = document.getElementById(imgId);
            if (el) el.src = cleanSrc;
          });
        }, 0);
      } else if (link.iconImg.endsWith(".png") || link.iconImg.endsWith(".svg") || link.isLogo) {
        iconContent = `<img src="${link.iconImg}" alt="${link.title}" class="w-7 h-7 object-contain rounded-lg">`;
      } else {
        iconContent = `<img src="${link.iconImg}" alt="${link.title}" class="w-7 h-7 object-cover rounded-full">`;
      }
    } else {
      iconContent = `<i class="${link.iconClass || 'fa-solid fa-link'}"></i>`;
    }

    a.innerHTML = `
      <div class="flex items-center gap-3.5 min-w-0">
        <div class="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
          ${iconContent}
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <h3 class="font-semibold text-sm text-slate-100 group-hover:text-indigo-400 transition-colors truncate">${link.title}</h3>
            ${link.badge ? `<span class="px-1.5 py-0.5 text-[9px] uppercase tracking-wide font-bold rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex-shrink-0">${link.badge}</span>` : ""}
          </div>
          ${link.subtitle ? `<p class="text-xs text-slate-400 truncate mt-0.5">${link.subtitle}</p>` : ""}
        </div>
      </div>
      <div class="text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all pl-2 flex-shrink-0">
        <i data-lucide="chevron-right" class="w-4 h-4"></i>
      </div>
    `;

    container.appendChild(a);
  });
}

// 5. Tema Dark & Light
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  applyTheme(savedTheme);

  const toggleBtn = document.getElementById("themeToggleBtn");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const current = document.documentElement.classList.contains("light") ? "light" : "dark";
      const next = current === "light" ? "dark" : "light";
      applyTheme(next);
      localStorage.setItem("theme", next);
    });
  }
}

function applyTheme(theme) {
  const icon = document.getElementById("themeIcon");
  if (theme === "light") {
    document.documentElement.classList.add("light");
    if (icon) icon.setAttribute("data-lucide", "moon");
  } else {
    document.documentElement.classList.remove("light");
    if (icon) icon.setAttribute("data-lucide", "sun");
  }
  if (window.lucide) {
    lucide.createIcons();
  }
}

// 6. Setup Event Listeners (Share, QR Code, Copy)
function setupEvents() {
  // Share Button
  const shareBtn = document.getElementById("shareBtn");
  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      const shareUrl = window.location.href;
      if (navigator.share) {
        try {
          await navigator.share({
            title: `${profileData.name} - Social Media & Links`,
            text: profileData.bio,
            url: shareUrl,
          });
        } catch (err) {
          // User dismissed or canceled
        }
      } else {
        copyToClipboard(shareUrl, "Tautan profil berhasil disalin!");
      }
    });
  }

  // QR Modal
  const qrBtn = document.getElementById("qrBtn");
  const qrModal = document.getElementById("qrModal");
  const qrModalCard = document.getElementById("qrModalCard");
  const closeQrBtn = document.getElementById("closeQrBtn");
  const qrImage = document.getElementById("qrImage");
  const copyModalLinkBtn = document.getElementById("copyModalLinkBtn");

  if (qrBtn && qrModal) {
    qrBtn.addEventListener("click", () => {
      const currentUrl = encodeURIComponent(window.location.href);
      if (qrImage) {
        qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${currentUrl}`;
      }
      qrModal.classList.remove("hidden");
      setTimeout(() => {
        qrModal.classList.remove("opacity-0");
        qrModalCard.classList.remove("scale-95");
      }, 10);
    });

    const closeModal = () => {
      qrModal.classList.add("opacity-0");
      qrModalCard.classList.add("scale-95");
      setTimeout(() => {
        qrModal.classList.add("hidden");
      }, 300);
    };

    if (closeQrBtn) closeQrBtn.addEventListener("click", closeModal);
    qrModal.addEventListener("click", (e) => {
      if (e.target === qrModal) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !qrModal.classList.contains("hidden")) {
        closeModal();
      }
    });

    if (copyModalLinkBtn) {
      copyModalLinkBtn.addEventListener("click", () => {
        copyToClipboard(window.location.href, "Tautan profil berhasil disalin!");
        closeModal();
      });
    }
  }
}

// Helper: Copy to Clipboard & Show Toast
function copyToClipboard(text, message = "Tautan berhasil disalin!") {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(message);
    }).catch(() => {
      fallbackCopy(text, message);
    });
  } else {
    fallbackCopy(text, message);
  }
}

function fallbackCopy(text, message) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
    showToast(message);
  } catch (err) {
    showToast("Gagal menyalin tautan.");
  }
  document.body.removeChild(textarea);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");
  if (!toast) return;

  if (toastMessage) toastMessage.textContent = message;
  toast.classList.remove("translate-y-20", "opacity-0");
  toast.classList.add("translate-y-0", "opacity-100");

  setTimeout(() => {
    toast.classList.remove("translate-y-0", "opacity-100");
    toast.classList.add("translate-y-20", "opacity-0");
  }, 2500);
}
