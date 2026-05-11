export type Language = 'vi' | 'zh';

export interface Stat {
  num: string;
  sup: string;
  label: {
    vi: string;
    zh: string;
  };
}

export interface Product {
  title: {
    vi: string;
    zh: string;
  };
  desc: {
    vi: string;
    zh: string;
  };
  img: string;
}

export interface ProfileData {
  companyPrefix: {
    vi: string;
    zh: string;
  };
  companyName: {
    vi: string;
    zh: string;
  };
  slogan: {
    vi: string;
    zh: string;
  };
  logoUrl: string;
  heroUrl: string;
  capabilityImageUrl: string;
  certImageUrls: string[];
  needsImageUrl: string;
  wechatQrUrl: string;
  info: {
    name: { vi: string, zh: string };
    address: { vi: string, zh: string };
    years: { vi: string, zh: string };
    rep: { vi: string, zh: string };
    industry: { vi: string, zh: string };
  };
  intro: {
    vi: string[];
    zh: string[];
  };
  stats: Stat[];
  products: Product[];
  capability: {
    vi: string[];
    zh: string[];
  };
  market: {
    vi: string;
    zh: string;
  };
  achievements: {
    vi: string[];
    zh: string[];
  };
  strengths: {
    vi: string[];
    zh: string[];
  };
  needs: {
    vi: string[];
    zh: string[];
  };
  hotline: string;
  email: string;
  website: string;
}

export const INITIAL_DATA: ProfileData = {
  companyPrefix: {
    vi: "Công Ty TNHH Thương Mại Truyền Thông",
    zh: "函龙传媒贸易有限公司"
  },
  companyName: {
    vi: "Hàm Rồng Media",
    zh: "函龙媒体"
  },
  slogan: {
    vi: "Sáng tạo · Đột phá · Bền vững",
    zh: "创意 · 突破 · 可持续"
  },
  logoUrl: "https://placehold.co/200x200/white/8B1322?text=LOGO",
  heroUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  capabilityImageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&q=70",
  certImageUrls: [
    "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=200&q=70",
    "https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=200&q=70"
  ],
  needsImageUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=300&q=70",
  wechatQrUrl: "",
  info: {
    name: {
      vi: "Trực thuộc<br>Hội DN Giao Thương Việt – Trung tại Thanh Hoá",
      zh: "隶属于<br>清化越中商贸协会"
    },
    address: {
      vi: "202 Đường Thanh Chương, Quảng Phú,<br>Thanh Hoá, Việt Nam",
      zh: "越南清化省广富县清总路202号"
    },
    years: {
      vi: "11 năm  |  Thành lập năm 2015",
      zh: "11年经验 | 成立于2015年"
    },
    rep: {
      vi: "Nguyễn Sỹ Mạnh  –  Giám đốc",
      zh: "阮士孟 – 总经理"
    },
    industry: {
      vi: "Lập trình  ·  Marketing Online  ·  Sàn TMĐT",
      zh: "编程 · 线上营销 · 电子商务平台"
    }
  },
  intro: {
    vi: [
      "Hàm Rồng Media là đơn vị tiên phong trong lĩnh vực lập trình, marketing online và vận hành kinh doanh trên các sàn thương mại điện tử tại khu vực Bắc Trung Bộ.",
      "Với hơn 11 năm đồng hành cùng hàng trăm doanh nghiệp, chúng tôi cam kết mang đến giải pháp công nghệ – truyền thông toàn diện, giúp khách hàng phát triển bền vững trong kỷ nguyên số."
    ],
    zh: [
      "函龙媒体是北中部地区编程、线上营销以及电子商务平台业务运营领域的先驱单位。",
      "11年来，我们与数百家企业同行，致力于提供全面的技术和传媒解决方案，助力客户在数字时代实现可持续发展。"
    ]
  },
  stats: [
    { num: "50", sup: "+", label: { vi: "Nhân Sự", zh: "员工" } },
    { num: "11", sup: " năm", label: { vi: "Kinh Nghiệm", zh: "经验" } },
    { num: "200", sup: "+", label: { vi: "Dự Án", zh: "项目" } },
    { num: "20", sup: "+", label: { vi: "Đối Tác", zh: "合作伙伴" } }
  ],
  products: [
    { 
      title: { vi: "Lập Trình Web & App", zh: "网页及应用编程" }, 
      desc: { vi: "Thiết kế website, ứng dụng di động chuẩn SEO, giao diện hiện đại, tốc độ tối ưu cho doanh nghiệp.", zh: "为企业设计符合 SEO 标准、界面现代、速度优化的网站和移动应用。" }, 
      img: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=200&q=70" 
    },
    { 
      title: { vi: "Marketing Online", zh: "线上营销" }, 
      desc: { vi: "Quảng cáo Google, Facebook, TikTok Ads – tăng đơn hàng, mở rộng thương hiệu hiệu quả.", zh: "Google、Facebook、TikTok 广告 —— 有效增加订单并扩大品牌知名度。" }, 
      img: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=200&q=70" 
    },
    { 
      title: { vi: "Bán Hàng Sàn TMĐT", zh: "电商平台销售" }, 
      desc: { vi: "Vận hành gian hàng Shopee, Lazada, TikTok Shop – tối ưu doanh số, đẩy mạnh chuyển đổi.", zh: "运营 Shopee、Lazada、TikTok Shop 店铺 —— 优化销售额并提高转化率。" }, 
      img: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=200&q=70" 
    },
    { 
      title: { vi: "Sản Xuất Nội Dung", zh: "内容制作" }, 
      desc: { vi: "Quay dựng video, chụp ảnh sản phẩm, viết bài chuẩn SEO – truyền tải thông điệp ấn tượng.", zh: "视频拍摄与剪辑、产品摄影、符合 SEO 标准的文章撰写 —— 传达令人印象深刻的信息。" }, 
      img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=200&q=70" 
    }
  ],
  capability: {
    vi: [
      "Đội ngũ: 50+ chuyên gia công nghệ & marketing",
      "Văn phòng làm việc: 500 m² tại Thanh Hoá",
      "Triển khai 200+ dự án/năm cho khách hàng",
      "Đối tác chính thức Google, Facebook, Shopee",
      "Quy trình vận hành chuẩn Agile, báo cáo minh bạch"
    ],
    zh: [
      "团队：50+ 技术和营销专家",
      "办公场所：在清化拥有 500 平方米的办公室",
      "每年为客户开展 200+ 个项目",
      "Google、Facebook、Shopee 官方合作伙伴",
      "标准的敏捷 (Agile) 运营流程，报告透明"
    ]
  },
  market: {
    vi: "Toàn quốc – tập trung Bắc Trung Bộ & Hà Nội",
    zh: "全国范围 —— 专注于北中部地区和河内"
  },
  achievements: {
    vi: [
      "Google Partner – Đối tác chính thức",
      "Top Agency Marketing Thanh Hoá 2023",
      "Đối tác đào tạo TikTok Shop miền Bắc",
      "Bằng khen Hiệp hội DN Thanh Hoá"
    ],
    zh: [
      "Google Partner —— 官方合作伙伴",
      "2023 年清化顶尖营销机构",
      "TikTok Shop 北部培训合作伙伴",
      "清化企业协会荣誉证书"
    ]
  },
  strengths: {
    vi: [
      "Chất lượng<br>vượt trội",
      "Công nghệ<br>hiện đại",
      "Giao hàng<br>đúng tiến độ",
      "Giá cả<br>cạnh tranh",
      "Dịch vụ hậu mãi<br>chuyên nghiệp"
    ],
    zh: [
      "卓越品质",
      "现代技术",
      "准时交付",
      "竞争价格",
      "专业售后服务"
    ]
  },
  needs: {
    vi: [
      "Khách hàng doanh nghiệp triển khai marketing số",
      "Hợp tác agency, freelancer sáng tạo nội dung",
      "Liên kết đào tạo nhân lực công nghệ – truyền thông",
      "Mở rộng đối tác sàn TMĐT, nền tảng quảng cáo",
      "Nhà đầu tư đồng hành mở rộng quy mô vận hành"
    ],
    zh: [
      "开展数字营销的企业客户",
      "内容创意机构及自由职业者合作",
      "技术与传媒人力资源培训联接",
      "扩大电商平台和广告平台合作伙伴",
      "共同扩展运营规模的投资者"
    ]
  },
  hotline: "0968 724 886",
  email: "info@hamrongmedia.com",
  website: "hamrongmedia.com"
};
