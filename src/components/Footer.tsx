/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Phone, Mail, MapPin, Heart, Shield, GraduationCap, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t-4 border-brand-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Main Grid Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Col 1: Brand & Bio */}
          <div>
            <div className="flex items-center space-x-2 text-white mb-4">
              <GraduationCap className="h-6 w-6 text-brand-primary" />
              <span className="font-display font-bold text-xl tracking-tight">
                Anh ngữ <span className="text-brand-primary">LeeGo</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Kiến tạo môi trường học tiếng Anh tự nhiên, sinh động và tràn đầy cảm hứng cho các bạn nhỏ theo giáo trình Everybody Up 4 chuẩn Oxford.
            </p>
          </div>

          {/* Col 2: Hotline & Fanpage */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm uppercase tracking-wider mb-4 border-l-2 border-brand-secondary pl-2">
              Thông tin Liên hệ
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-brand-secondary flex-shrink-0" />
                <span>
                  Hotline hỗ trợ: <a href="tel:0988526585" className="text-white hover:text-brand-secondary font-semibold">0988.526.585</a>
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-brand-blue font-extrabold text-[10px] uppercase tracking-wide">Fanpage:</span>
                <span className="text-white font-semibold">Anh ngữ LEEGO Hải Phòng</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Education program & Quality */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm uppercase tracking-wider mb-4 border-l-2 border-brand-blue pl-2">
              Giáo trình & Công nghệ
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Giáo trình Oxford Everybody Up 4 dành cho học sinh tiểu học. Tích hợp AI Speaking Coach, báo cáo kết quả và đồng bộ hóa Google Sheets.
            </p>
            <div className="flex items-center space-x-1.5 bg-slate-800 p-2 rounded-xl border border-slate-700/50 w-fit">
              <Shield className="h-3.5 w-3.5 text-brand-yellow" />
              <span className="text-[10px] font-semibold uppercase text-brand-yellow tracking-wide">
                Hệ thống chuẩn Oxford EdTech
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 my-8"></div>

        {/* Footer bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Anh ngữ LeeGo. All rights reserved.</p>
          <div className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Xây dựng với</span>
            <Heart className="h-3 w-3 text-brand-primary fill-brand-primary animate-pulse" />
            <span>dành cho học viên tiểu học Việt Nam</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
