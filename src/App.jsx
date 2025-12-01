import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Users, MapPin, FileText, DollarSign, Car, Upload, Printer, Trash2, Plus, Save, Lock, LogOut, UserCog } from 'lucide-react';

// 유류비 기준 단가 (원/km) - 회사 내규에 따라 수정 가능
const FUEL_RATE_PERSONAL = 200; 

// --- 관리자용 컴포넌트 ---
function AdminLoginModal({ onClose, onLogin }) {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const storedAdmin = JSON.parse(localStorage.getItem('adminCredentials')) || { id: 'admin', password: 'admin' };
    if (adminId === storedAdmin.id && password === storedAdmin.password) {
      onLogin(storedAdmin);
      onClose();
    } else {
      setError('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96 animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-600">
          <Lock size={24} /> 관리자 로그인
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="아이디"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            로그인
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ reports, onViewReport, onChangePassword, onLogout }) {
  return (
    <div className="p-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
          <UserCog size={28} className="text-blue-600" /> 관리자 대시보드
        </h2>
        <div className="flex gap-2">
          <button onClick={onChangePassword} className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded shadow-sm text-sm transition font-medium">
            <UserCog size={16} /> 비밀번호 변경
          </button>
          <button onClick={onLogout} className="flex items-center gap-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded shadow-sm text-sm transition font-bold">
            <LogOut size={16} /> 로그아웃
          </button>
        </div>
      </div>
      
      <section className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-bold flex items-center gap-2 text-gray-700">
            <FileText className="text-blue-600" size={20} /> 제출된 보고서 목록
          </h3>
          <span className="text-sm text-gray-500">총 {reports.length}건</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
              <tr>
                <th scope="col" className="px-6 py-3 font-bold">제출일</th>
                <th scope="col" className="px-6 py-3 font-bold">출장자</th>
                <th scope="col" className="px-6 py-3 font-bold">출장지</th>
                <th scope="col" className="px-6 py-3 font-bold">기간</th>
                <th scope="col" className="px-6 py-3 font-bold text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.length > 0 ? (
                reports.map((report) => (
                  <tr key={report.id} className="bg-white hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(report.submittedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{report.travelerName}</td>
                    <td className="px-6 py-4">{report.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{report.startDate} ~ {report.endDate}</td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => onViewReport(report)} 
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition text-xs font-bold"
                      >
                        <FileText size={12} /> 상세보기
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText size={48} className="text-gray-200" />
                      <p>아직 제출된 보고서가 없습니다.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function PasswordChangeModal({ onClose, adminCredentials }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChangePassword = () => {
    if (currentPassword !== adminCredentials.password) {
      setError('현재 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (newPassword.length < 4) {
      setError('새 비밀번호는 4자리 이상이어야 합니다.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    const newCredentials = { ...adminCredentials, password: newPassword };
    localStorage.setItem('adminCredentials', JSON.stringify(newCredentials));
    setSuccess('비밀번호가 성공적으로 변경되었습니다.');
    setError('');
    setTimeout(onClose, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96 animate-fade-in">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-600">
          <UserCog size={24} /> 비밀번호 변경
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
        <div className="space-y-4">
          <input
            type="password"
            placeholder="현재 비밀번호"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="password"
            placeholder="새 비밀번호 (4자리 이상)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="password"
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            onClick={handleChangePassword}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            변경하기
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}


export default function App() {
  // --- 상태 관리 (State) ---
  const [activeTab, setActiveTab] = useState('report'); // 'report', 'preview', 'admin'
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState(null);
  const [submittedReports, setSubmittedReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  // A4 출력 스타일 정의 (CSS in JS)
  const printStyles = `
    @media print {
      @page {
        size: A4;
        margin: 0;
      }
      body {
        margin: 0;
        padding: 0;
        background-color: white;
        -webkit-print-color-adjust: exact;
      }
      .print-hidden {
        display: none !important;
      }
      .print-container {
        width: 210mm;
        min-height: 297mm;
        margin: 0;
        padding: 20mm;
        box-shadow: none;
        border: none;
        page-break-after: always;
      }
    }
    
    /* 화면용 A4 미리보기 스타일 */
    .a4-preview-container {
      width: 210mm;
      min-height: 297mm;
      padding: 20mm;
      margin: 0 auto;
      background: white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border: 1px solid #e5e7eb;
    }
  `;

  // 출력 핸들러
  const handlePrint = () => {
    window.print();
  };

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    travelerName: '',
    travelerCount: 1,
    location: '',
    purpose: '',
    content: '',
    vehicleType: 'company', // 'company' or 'personal'
    distance: 0,
    fuelCost: 0,
    expenses: [
      { id: 1, category: '식비', description: '점심 식사', amount: 0 },
    ],
    receipts: [] // { id, name, url }
  });

  // 로컬 스토리지에서 불러오기
  useEffect(() => {
    // 1. 임시 저장된 보고서 불러오기
    const savedData = localStorage.getItem('tripReportDraft');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({ ...prev, ...parsed, receipts: [] }));
      } catch (e) {
        console.error("임시 저장 오류", e);
      }
    }

    // 2. 관리자 계정 초기화 (없으면 기본값 생성)
    const storedCreds = localStorage.getItem('adminCredentials');
    if (!storedCreds) {
      const defaultCreds = { id: 'admin', password: 'admin' };
      localStorage.setItem('adminCredentials', JSON.stringify(defaultCreds));
      setAdminCredentials(defaultCreds);
    } else {
      setAdminCredentials(JSON.parse(storedCreds));
    }

    // 3. 제출된 보고서 목록 불러오기
    const reports = localStorage.getItem('submittedReports');
    if (reports) {
      try {
        setSubmittedReports(JSON.parse(reports));
      } catch (e) {
        console.error("보고서 목록 불러오기 오류", e);
      }
    }
  }, []);

  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'distance' || name === 'vehicleType') {
        const dist = name === 'distance' ? parseFloat(value) || 0 : prev.distance;
        const vType = name === 'vehicleType' ? value : prev.vehicleType;
        if (vType === 'personal') {
          newData.fuelCost = dist * FUEL_RATE_PERSONAL;
        } else {
          newData.fuelCost = 0;
        }
      }
      return newData;
    });
  };

  // 경비 관리 함수들
  const addExpense = () => {
    const newId = formData.expenses.length > 0 ? Math.max(...formData.expenses.map(e => e.id)) + 1 : 1;
    setFormData(prev => ({
      ...prev,
      expenses: [...prev.expenses, { id: newId, category: '기타', description: '', amount: 0 }]
    }));
  };

  const removeExpense = (id) => {
    setFormData(prev => ({ ...prev, expenses: prev.expenses.filter(e => e.id !== id) }));
  };

  const handleExpenseChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      expenses: prev.expenses.map(e => e.id === id ? { ...e, [field]: field === 'amount' ? parseInt(value) || 0 : value } : e)
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          receipts: [...prev.receipts, { id: Date.now(), name: file.name, url: reader.result }]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReceipt = (id) => {
    setFormData(prev => ({ ...prev, receipts: prev.receipts.filter(r => r.id !== id) }));
  };

  const calculateTotal = (data = formData) => {
    const expenseTotal = data.expenses.reduce((sum, item) => sum + item.amount, 0);
    return expenseTotal + data.fuelCost;
  };

  // 저장 및 제출 로직
  const handleSaveDraft = () => {
    const dataToSave = { ...formData, receipts: [] };
    localStorage.setItem('tripReportDraft', JSON.stringify(dataToSave));
    alert('임시 저장되었습니다.');
  };

  const handleSubmitReport = () => {
    if (!formData.travelerName || !formData.startDate || !formData.endDate) {
      alert('필수 정보(출장자, 기간)를 모두 입력해주세요.');
      return;
    }
    if (window.confirm('보고서를 제출하시겠습니까? (제출 후 수정 불가)')) {
      const newReport = { ...formData, id: Date.now(), submittedAt: new Date().toISOString() };
      const updatedReports = [newReport, ...submittedReports]; // 최신순 정렬
      setSubmittedReports(updatedReports);
      localStorage.setItem('submittedReports', JSON.stringify(updatedReports));
      localStorage.removeItem('tripReportDraft');
      alert('보고서가 성공적으로 제출되었습니다.');
      setFormData({
        startDate: '', endDate: '', travelerName: '', travelerCount: 1, location: '', purpose: '', content: '', vehicleType: 'company', distance: 0, fuelCost: 0, expenses: [{ id: 1, category: '식비', description: '점심 식사', amount: 0 }], receipts: []
      });
      setActiveTab('report');
    }
  };

  // 관리자 로직
  const handleAdminLogin = (credentials) => {
    setIsAdminLoggedIn(true);
    setAdminCredentials(credentials);
    setActiveTab('admin');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setActiveTab('report');
    setSelectedReport(null);
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setActiveTab('preview');
  };

  const formatCurrency = (num) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(num);

  // --- 프리뷰 렌더링 ---
  const renderPreview = (data) => (
    <div className="bg-gray-100 min-h-screen p-8 print:bg-white print:p-0">
      <style>{printStyles}</style> {/* 동적 스타일 주입 */}
      
      {/* 상단 툴바 (인쇄 시 숨김) */}
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center print-hidden">
        {isAdminLoggedIn && selectedReport ? (
          <button onClick={() => { setSelectedReport(null); setActiveTab('admin'); }} className="text-gray-600 hover:text-gray-900 font-bold flex items-center gap-1">
            &larr; 목록으로
          </button>
        ) : (
          <button onClick={() => setActiveTab('report')} className="text-gray-600 hover:text-gray-900 font-bold flex items-center gap-1">
            &larr; 수정하기
          </button>
        )}
        
        <div className="flex gap-2">
          {!isAdminLoggedIn && !selectedReport && (
            <button onClick={handleSubmitReport} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition flex items-center gap-2 font-bold">
              <FileText size={18} /> 제출하기
            </button>
          )}
          <button onClick={handlePrint} className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-gray-900 transition flex items-center gap-2 font-bold">
            <Printer size={18} /> 인쇄 / PDF 저장
          </button>
        </div>
      </div>

      {/* A4 실제 문서 영역 */}
      <div className="a4-preview-container print-container">
        <h1 className="text-3xl font-bold text-center mb-10 underline decoration-4 decoration-gray-300 underline-offset-8">출 장 보 고 서</h1>
        
        <div className="flex justify-end mb-8 text-center text-sm">
          <table className="border-collapse border border-gray-400">
            <tbody>
              <tr>
                <td className="border border-gray-400 bg-gray-100 p-1 w-16">담당</td>
                <td className="border border-gray-400 bg-gray-100 p-1 w-16">팀장</td>
                <td className="border border-gray-400 bg-gray-100 p-1 w-16">부서장</td>
              </tr>
              <tr>
                <td className="border border-gray-400 h-16"></td>
                <td className="border border-gray-400 h-16"></td>
                <td className="border border-gray-400 h-16"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <table className="w-full border-collapse border border-gray-400 mb-6 text-sm">
          <tbody>
            <tr>
              <td className="border border-gray-400 bg-gray-100 p-2 font-bold w-1/5">출장 기간</td>
              <td className="border border-gray-400 p-2 w-2/5">{data.startDate} ~ {data.endDate}</td>
              <td className="border border-gray-400 bg-gray-100 p-2 font-bold w-1/5">출장자</td>
              <td className="border border-gray-400 p-2 w-1/5">{data.travelerName} 외 {data.travelerCount - 1}명</td>
            </tr>
            <tr>
              <td className="border border-gray-400 bg-gray-100 p-2 font-bold">출장 장소</td>
              <td className="border border-gray-400 p-2" colSpan="3">{data.location}</td>
            </tr>
            <tr>
              <td className="border border-gray-400 bg-gray-100 p-2 font-bold">출장 목적</td>
              <td className="border border-gray-400 p-2" colSpan="3">{data.purpose}</td>
            </tr>
          </tbody>
        </table>

        <div className="mb-6">
          <h3 className="font-bold mb-2 text-sm border-l-4 border-gray-600 pl-2">상세 보고 내용</h3>
          <div className="border border-gray-400 p-4 min-h-[150px] whitespace-pre-wrap text-sm leading-relaxed">
            {data.content || "내용 없음"}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-2 text-sm border-l-4 border-gray-600 pl-2">경비 정산 내역</h3>
          <table className="w-full border-collapse border border-gray-400 text-sm text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 p-2">구분</th>
                <th className="border border-gray-400 p-2">내역</th>
                <th className="border border-gray-400 p-2">금액</th>
                <th className="border border-gray-400 p-2">비고</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-400 p-2">교통/유류비</td>
                <td className="border border-gray-400 p-2 text-left">
                  {data.vehicleType === 'personal' ? `개인차량 (${data.distance}km * ${FUEL_RATE_PERSONAL}원)` : `법인차량 (${data.distance}km)`}
                </td>
                <td className="border border-gray-400 p-2 text-right">{formatCurrency(data.fuelCost)}</td>
                <td className="border border-gray-400 p-2 text-gray-500">{data.vehicleType === 'personal' ? '' : '법인카드'}</td>
              </tr>
              {data.expenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="border border-gray-400 p-2">{expense.category}</td>
                  <td className="border border-gray-400 p-2 text-left">{expense.description}</td>
                  <td className="border border-gray-400 p-2 text-right">{formatCurrency(expense.amount)}</td>
                  <td className="border border-gray-400 p-2"></td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-bold">
                <td className="border border-gray-400 p-2" colSpan="2">합 계</td>
                <td className="border border-gray-400 p-2 text-right text-blue-600">{formatCurrency(calculateTotal(data))}</td>
                <td className="border border-gray-400 p-2"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {data.receipts.length > 0 && (
          <div className="break-inside-avoid">
            <h3 className="font-bold mb-2 text-sm border-l-4 border-gray-600 pl-2">증빙 자료</h3>
            <div className="grid grid-cols-2 gap-4">
              {data.receipts.map(receipt => (
                <div key={receipt.id} className="border border-gray-300 p-2 break-inside-avoid">
                  <img src={receipt.url} alt="증빙" className="max-w-full max-h-60 mx-auto object-contain" />
                  <p className="text-center text-xs mt-1 text-gray-500">{receipt.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">위와 같이 출장 결과를 보고하며 경비를 청구합니다.</p>
          <p className="mt-4 font-bold">{new Date().getFullYear()}년 {new Date().getMonth() + 1}월 {new Date().getDate()}일</p>
          <p className="mt-2 font-bold">신청자 : {data.travelerName} (인)</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans print:bg-white">
      {/* 헤더 */}
      <header className="bg-blue-600 text-white p-4 shadow-md print-hidden">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center gap-2 cursor-pointer" onClick={() => !isAdminLoggedIn && setActiveTab('report')}>
            <FileText size={24} /> HENCE 출장 보고 및 비용 정산
          </h1>
          <div className="flex gap-2">
            {!isAdminLoggedIn ? (
              <>
                <button onClick={handleSaveDraft} className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-400 rounded text-sm transition">
                  <Save size={16} /> 임시저장
                </button>
                <button onClick={() => { setActiveTab('report'); setSelectedReport(null); }} className={`px-4 py-2 rounded font-medium transition ${activeTab === 'report' ? 'bg-white text-blue-600' : 'bg-blue-700 text-white'}`}>
                  작성하기
                </button>
                <button onClick={() => setIsAdminLoginModalOpen(true)} className="px-4 py-2 rounded font-medium transition bg-blue-800 text-white hover:bg-blue-900 flex items-center gap-1 shadow-sm">
                  <Lock size={16} /> 관리자
                </button>
              </>
            ) : (
              <button onClick={() => { setActiveTab('admin'); setSelectedReport(null); }} className={`px-4 py-2 rounded font-medium transition flex items-center gap-1 ${activeTab === 'admin' ? 'bg-white text-blue-600' : 'bg-blue-700 text-white'}`}>
                <UserCog size={18} /> 관리자 모드
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-6xl mx-auto p-6 print:p-0 print:max-w-none print:mx-0">
        
        {/* 1. 작성 폼 */}
        {activeTab === 'report' && !isAdminLoggedIn && (
          <div className="space-y-6 animate-fade-in print-hidden max-w-4xl mx-auto">
            {/* 기본 정보 */}
            <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b pb-2">
                <Calendar className="text-blue-600" size={20} /> 출장 기본 정보
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">시작일</label>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">종료일</label>
                  <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">출장자 성명</label>
                  <input type="text" name="travelerName" placeholder="홍길동" value={formData.travelerName} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">출장 인원 (명)</label>
                  <input type="number" name="travelerCount" min="1" value={formData.travelerCount} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </section>

            {/* 장소 및 내용 */}
            <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b pb-2">
                <MapPin className="text-blue-600" size={20} /> 장소 및 내용
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">출장 장소</label>
                  <input type="text" name="location" placeholder="서울시 강남구 삼성동 거래처 본사" value={formData.location} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">출장 목적</label>
                  <input type="text" name="purpose" placeholder="신규 프로젝트 킥오프 미팅" value={formData.purpose} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">상세 보고 내용</label>
                  <textarea name="content" rows="5" placeholder="주요 협의 내용 및 결과 요약..." value={formData.content} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
                </div>
              </div>
            </section>

            {/* 교통 및 유류비 */}
            <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b pb-2">
                <Car className="text-blue-600" size={20} /> 교통수단 및 유류비 정산
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">차량 구분</label>
                  <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="company">법인 차량 (유류비 미지급)</option>
                    <option value="personal">개인 차량 (유류비 지급)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">운행 거리 (km)</label>
                  <input type="number" name="distance" placeholder="0" value={formData.distance} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-right" />
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  * 개인 차량 기준: {FUEL_RATE_PERSONAL}원/km 적용
                </span>
                <span className="text-lg font-bold text-blue-600">
                  유류비 산출: {formatCurrency(formData.fuelCost)}
                </span>
              </div>
            </section>

            {/* 경비 내역 */}
            <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b pb-2">
                <DollarSign className="text-blue-600" size={20} /> 지출 경비 내역
              </h2>
              
              <div className="space-y-3 mb-4">
                {formData.expenses.map((expense) => (
                  <div key={expense.id} className="flex flex-col md:flex-row gap-2 items-start md:items-center bg-gray-50 p-3 rounded">
                    <select 
                      value={expense.category}
                      onChange={(e) => handleExpenseChange(expense.id, 'category', e.target.value)}
                      className="p-2 border rounded w-full md:w-32"
                    >
                      <option>식비</option>
                      <option>숙박비</option>
                      <option>통행료</option>
                      <option>접대비</option>
                      <option>기타</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="내용 (예: 점심식사)" 
                      value={expense.description}
                      onChange={(e) => handleExpenseChange(expense.id, 'description', e.target.value)}
                      className="p-2 border rounded flex-grow w-full"
                    />
                    <input 
                      type="number" 
                      placeholder="금액" 
                      value={expense.amount}
                      onChange={(e) => handleExpenseChange(expense.id, 'amount', e.target.value)}
                      className="p-2 border rounded w-full md:w-40 text-right"
                    />
                    <button onClick={() => removeExpense(expense.id)} className="p-2 text-red-500 hover:bg-red-100 rounded">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
              
              <button onClick={addExpense} className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800">
                <Plus size={16} /> 항목 추가하기
              </button>

              <div className="mt-6 text-right border-t pt-4">
                <p className="text-gray-600">유류비 포함 총 청구 금액</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(calculateTotal())}</p>
              </div>
            </section>

             {/* 증빙 자료 */}
             <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b pb-2">
                <Upload className="text-blue-600" size={20} /> 증빙 자료 (영수증)
              </h2>
              <div className="flex items-center gap-4 mb-4">
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded flex items-center gap-2 transition">
                  <Upload size={18} /> 사진 업로드
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
                <span className="text-sm text-gray-500">이미지 파일(JPG, PNG)만 가능</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.receipts.map(receipt => (
                  <div key={receipt.id} className="relative group border rounded-lg overflow-hidden">
                    <img src={receipt.url} alt="Receipt" className="w-full h-32 object-cover" />
                    <button 
                      onClick={() => removeReceipt(receipt.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                    <p className="text-xs p-1 bg-gray-50 truncate">{receipt.name}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex justify-center pt-6">
              <button onClick={() => { setActiveTab('preview'); setSelectedReport(formData); }} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 shadow-lg transition">
                작성 완료 및 미리보기
              </button>
            </div>
          </div>
        )}

        {/* 2. 미리보기 화면 (A4) */}
        {activeTab === 'preview' && selectedReport && renderPreview(selectedReport)}

        {/* 3. 관리자 대시보드 */}
        {activeTab === 'admin' && isAdminLoggedIn && (
          <AdminDashboard
            reports={submittedReports}
            onViewReport={handleViewReport}
            onChangePassword={() => setIsPasswordChangeModalOpen(true)}
            onLogout={handleAdminLogout}
          />
        )}

        {/* --- 모달 --- */}
        {isAdminLoginModalOpen && (
          <AdminLoginModal
            onClose={() => setIsAdminLoginModalOpen(false)}
            onLogin={handleAdminLogin}
          />
        )}
        {isPasswordChangeModalOpen && adminCredentials && (
          <PasswordChangeModal
            onClose={() => setIsPasswordChangeModalOpen(false)}
            adminCredentials={adminCredentials}
          />
        )}

      </main>
    </div>
  );
}