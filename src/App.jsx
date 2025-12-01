import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, FileText, DollarSign, Car, Upload, Printer, Trash2, Plus, Save, Lock, LogOut, UserCog, RefreshCw, CheckCircle, Send, Edit3, XCircle } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-sm md:w-96 transform transition-all scale-100">
        <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2 text-blue-700">
          <Lock size={24} /> 관리자 로그인
        </h2>
        {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded border border-red-100">{error}</p>}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="아이디"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md"
          >
            로그인
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all"
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
    <div className="p-4 md:p-8 animate-fade-in w-full max-w-[1920px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
          <UserCog size={28} className="text-blue-600" /> 관리자 대시보드
        </h2>
        <div className="flex gap-2 w-full md:w-auto">
          <button onClick={onChangePassword} className="flex-1 md:flex-none flex items-center justify-center gap-1 px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg shadow-sm text-sm transition font-medium">
            <UserCog size={16} /> 비밀번호 변경
          </button>
          <button onClick={onLogout} className="flex-1 md:flex-none flex items-center justify-center gap-1 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md text-sm transition font-bold">
            <LogOut size={16} /> 로그아웃
          </button>
        </div>
      </div>
      
      <section className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-5 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-bold flex items-center gap-2 text-gray-700">
            <FileText className="text-blue-600" size={20} /> 제출된 보고서 목록
          </h3>
          <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">총 {reports.length}건</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600 min-w-[800px]">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold">제출일</th>
                <th scope="col" className="px-6 py-4 font-bold">출장자</th>
                <th scope="col" className="px-6 py-4 font-bold">출장지</th>
                <th scope="col" className="px-6 py-4 font-bold">기간</th>
                <th scope="col" className="px-6 py-4 font-bold text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.length > 0 ? (
                reports.map((report) => (
                  <tr key={report.id} className="bg-white hover:bg-blue-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(report.submittedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{report.travelerName}</td>
                    <td className="px-6 py-4 truncate max-w-[200px] text-gray-700">{report.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{report.startDate} ~ {report.endDate}</td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => onViewReport(report)} 
                        className="inline-flex items-center gap-1 px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition text-xs font-bold shadow-sm"
                      >
                        <FileText size={12} /> 상세보기
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="p-4 bg-gray-50 rounded-full">
                        <FileText size={48} className="text-gray-300" />
                      </div>
                      <p className="text-base">아직 제출된 보고서가 없습니다.</p>
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-sm md:w-96 animate-fade-in">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-700">
          <UserCog size={24} /> 비밀번호 변경
        </h2>
        {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4 bg-green-50 p-2 rounded">{success}</p>}
        <div className="space-y-4">
          <input
            type="password"
            placeholder="현재 비밀번호"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="password"
            placeholder="새 비밀번호 (4자리 이상)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="password"
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            onClick={handleChangePassword}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md"
          >
            변경하기
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition"
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
  const [activeTab, setActiveTab] = useState('report');
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState(null);
  const [submittedReports, setSubmittedReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [editingId, setEditingId] = useState(null); // 수정 중인 보고서 ID

  // A4 출력 스타일
  const printStyles = `
    @media print {
      @page { size: A4; margin: 0; }
      body { margin: 0; padding: 0; background-color: white; -webkit-print-color-adjust: exact; }
      .print-hidden { display: none !important; }
      .print-container { width: 210mm; min-height: 297mm; margin: 0; padding: 20mm; box-shadow: none; border: none; page-break-after: always; }
    }
    .a4-preview-container { width: 210mm; min-height: 297mm; padding: 20mm; margin: 0 auto; background: white; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; }
    @media (max-width: 768px) { .a4-preview-container { width: 100%; padding: 20px; min-height: auto; box-shadow: none; border: none; } }
  `;

  const handlePrint = () => window.print();

  const [formData, setFormData] = useState({
    startDate: '', endDate: '', travelerName: '', travelerCount: 1, location: '', purpose: '', content: '', vehicleType: 'company', distance: 0, fuelCost: 0,
    expenses: [{ id: 1, category: '식비', description: '점심 식사', amount: 0 }],
    receipts: []
  });

  useEffect(() => {
    const savedData = localStorage.getItem('tripReportDraft');
    if (savedData) {
      try { const parsed = JSON.parse(savedData); setFormData(prev => ({ ...prev, ...parsed, receipts: [] })); } catch (e) { console.error(e); }
    }
    const storedCreds = localStorage.getItem('adminCredentials');
    if (!storedCreds) {
      const defaultCreds = { id: 'admin', password: 'admin' };
      localStorage.setItem('adminCredentials', JSON.stringify(defaultCreds));
      setAdminCredentials(defaultCreds);
    } else {
      setAdminCredentials(JSON.parse(storedCreds));
    }
    const reports = localStorage.getItem('submittedReports');
    if (reports) { try { setSubmittedReports(JSON.parse(reports)); } catch (e) { console.error(e); } }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'distance' || name === 'vehicleType') {
        const dist = name === 'distance' ? parseFloat(value) || 0 : prev.distance;
        const vType = name === 'vehicleType' ? value : prev.vehicleType;
        newData.fuelCost = vType === 'personal' ? dist * FUEL_RATE_PERSONAL : 0;
      }
      return newData;
    });
  };

  const addExpense = () => {
    const newId = formData.expenses.length > 0 ? Math.max(...formData.expenses.map(e => e.id)) + 1 : 1;
    setFormData(prev => ({ ...prev, expenses: [...prev.expenses, { id: newId, category: '기타', description: '', amount: 0 }] }));
  };

  const removeExpense = (id) => { setFormData(prev => ({ ...prev, expenses: prev.expenses.filter(e => e.id !== id) })); };
  
  const handleExpenseChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev, expenses: prev.expenses.map(e => e.id === id ? { ...e, [field]: field === 'amount' ? parseInt(value) || 0 : value } : e)
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, receipts: [...prev.receipts, { id: Date.now(), name: file.name, url: reader.result }] }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReceipt = (id) => { setFormData(prev => ({ ...prev, receipts: prev.receipts.filter(r => r.id !== id) })); };
  const calculateTotal = (data = formData) => data.expenses.reduce((sum, item) => sum + item.amount, 0) + data.fuelCost;

  const handleSaveDraft = () => {
    const dataToSave = { ...formData, receipts: [] };
    localStorage.setItem('tripReportDraft', JSON.stringify(dataToSave));
    alert('임시 저장되었습니다.');
  };

  const handleResetForm = () => {
    if(window.confirm('작성 중인 내용을 모두 지우고 초기화하시겠습니까?')) {
      setFormData({ startDate: '', endDate: '', travelerName: '', travelerCount: 1, location: '', purpose: '', content: '', vehicleType: 'company', distance: 0, fuelCost: 0, expenses: [{ id: 1, category: '식비', description: '점심 식사', amount: 0 }], receipts: [] });
      localStorage.removeItem('tripReportDraft');
    }
  };

  // --- 관리자: 보고서 삭제 ---
  const handleDeleteReport = () => {
    if (selectedReport && window.confirm('정말로 이 보고서를 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다.')) {
      const updatedReports = submittedReports.filter(r => r.id !== selectedReport.id);
      setSubmittedReports(updatedReports);
      localStorage.setItem('submittedReports', JSON.stringify(updatedReports));
      alert('보고서가 삭제되었습니다.');
      setSelectedReport(null);
      setActiveTab('admin');
    }
  };

  // --- 관리자: 수정 모드 진입 ---
  const handleStartAdminEdit = () => {
    if (selectedReport) {
      setFormData({ ...selectedReport });
      setEditingId(selectedReport.id);
      setActiveTab('report'); // 폼 화면으로 이동
      // 관리자 로그인 상태 유지됨
    }
  };

  const handleSubmitReport = () => {
    if (!formData.travelerName || !formData.startDate || !formData.endDate) { alert('필수 정보(출장자, 기간)를 모두 입력해주세요.'); return; }
    
    const isEditMode = !!editingId;
    const confirmMessage = isEditMode ? '수정된 내용을 저장하시겠습니까?' : '보고서를 제출하시겠습니까? (제출 후 수정 불가)';

    if (window.confirm(confirmMessage)) {
      let updatedReports;
      
      if (isEditMode) {
        // 기존 보고서 수정
        updatedReports = submittedReports.map(r => 
          r.id === editingId ? { ...formData, id: editingId, submittedAt: r.submittedAt } : r
        );
        alert('성공적으로 수정되었습니다.');
      } else {
        // 새 보고서 생성
        const newReport = { ...formData, id: Date.now(), submittedAt: new Date().toISOString() };
        updatedReports = [newReport, ...submittedReports];
        alert('보고서가 성공적으로 제출되었습니다.');
      }

      setSubmittedReports(updatedReports);
      localStorage.setItem('submittedReports', JSON.stringify(updatedReports));
      
      // 임시 저장 삭제 (새 제출일 경우만)
      if (!isEditMode) localStorage.removeItem('tripReportDraft');
      
      // 폼 초기화
      setFormData({ startDate: '', endDate: '', travelerName: '', travelerCount: 1, location: '', purpose: '', content: '', vehicleType: 'company', distance: 0, fuelCost: 0, expenses: [{ id: 1, category: '식비', description: '점심 식사', amount: 0 }], receipts: [] });
      setEditingId(null);

      // 이동
      if (isAdminLoggedIn) {
        setActiveTab('admin');
        setSelectedReport(null);
      } else {
        setActiveTab('report');
      }
    }
  };

  const handleAdminLogin = (credentials) => { setIsAdminLoggedIn(true); setAdminCredentials(credentials); setActiveTab('admin'); };
  
  const handleAdminLogout = () => { 
    setIsAdminLoggedIn(false); 
    setActiveTab('report'); 
    setSelectedReport(null); 
    setEditingId(null);
    setFormData({ startDate: '', endDate: '', travelerName: '', travelerCount: 1, location: '', purpose: '', content: '', vehicleType: 'company', distance: 0, fuelCost: 0, expenses: [{ id: 1, category: '식비', description: '점심 식사', amount: 0 }], receipts: [] });
  };
  
  const handleViewReport = (report) => { setSelectedReport(report); setActiveTab('preview'); };
  
  // 미리보기 화면에서 '내용 수정' 클릭 시 (일반 사용자)
  const handleEditContent = () => {
    setActiveTab('report');
  };

  const formatCurrency = (num) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(num);

  const renderPreview = (data) => (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8 print:bg-white print:p-0">
      <style>{printStyles}</style>
      <div className="max-w-[210mm] mx-auto mb-6 flex flex-col md:flex-row justify-between items-center gap-4 print-hidden">
        {/* 관리자: 목록으로 가기 */}
        {isAdminLoggedIn && selectedReport ? (
          <button onClick={() => { setSelectedReport(null); setActiveTab('admin'); }} className="text-gray-600 hover:text-gray-900 font-bold flex items-center gap-1">
            &larr; 목록으로
          </button>
        ) : (
          /* 일반 사용자: 수정하기 (화면 전환) */
          <button onClick={() => setActiveTab('report')} className="text-gray-600 hover:text-gray-900 font-bold flex items-center gap-1">
            &larr; 수정하기
          </button>
        )}
        
        <div className="flex gap-2 w-full md:w-auto justify-end">
          {/* 관리자 기능: 수정/삭제 버튼 추가 */}
          {isAdminLoggedIn && selectedReport && (
            <>
              <button onClick={handleStartAdminEdit} className="flex-1 md:flex-none bg-blue-600 text-white px-4 py-2.5 rounded-lg shadow-md hover:bg-blue-700 transition flex justify-center items-center gap-2 font-bold">
                <Edit3 size={18} /> 내용 수정
              </button>
              <button onClick={handleDeleteReport} className="flex-1 md:flex-none bg-red-500 text-white px-4 py-2.5 rounded-lg shadow-md hover:bg-red-600 transition flex justify-center items-center gap-2 font-bold">
                <Trash2 size={18} /> 보고서 삭제
              </button>
            </>
          )}

          {!isAdminLoggedIn && !selectedReport && (
            <button onClick={handleSubmitReport} className="flex-1 md:flex-none bg-blue-600 text-white px-6 py-2.5 rounded-lg shadow-md hover:bg-blue-700 transition flex justify-center items-center gap-2 font-bold">
              <CheckCircle size={18} /> 제출하기
            </button>
          )}
          <button onClick={handlePrint} className="flex-1 md:flex-none bg-gray-800 text-white px-6 py-2.5 rounded-lg shadow-md hover:bg-gray-900 transition flex justify-center items-center gap-2 font-bold">
            <Printer size={18} /> 인쇄 / PDF
          </button>
        </div>
      </div>
      <div className="a4-preview-container print-container">
        <h1 className="text-3xl font-bold text-center mb-10 underline decoration-4 decoration-gray-300 underline-offset-8">출 장 보 고 서</h1>
        <div className="flex justify-end mb-8 text-center text-sm">
          <table className="border-collapse border border-gray-400">
            <tbody>
              <tr>
                <td className="border border-gray-400 bg-gray-100 p-1 w-20">담당</td>
                <td className="border border-gray-400 bg-gray-100 p-1 w-20">팀장</td>
                <td className="border border-gray-400 bg-gray-100 p-1 w-20">부서장</td>
              </tr>
              <tr>
                <td className="border border-gray-400 h-20"></td><td className="border border-gray-400 h-20"></td><td className="border border-gray-400 h-20"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <table className="w-full border-collapse border border-gray-400 mb-6 text-sm">
          <tbody>
            <tr>
              <td className="border border-gray-400 bg-gray-100 p-3 font-bold w-1/5 whitespace-nowrap text-center">출장 기간</td>
              <td className="border border-gray-400 p-3 w-2/5">{data.startDate} ~ {data.endDate}</td>
              <td className="border border-gray-400 bg-gray-100 p-3 font-bold w-1/5 whitespace-nowrap text-center">출장자</td>
              <td className="border border-gray-400 p-3 w-1/5 text-center">{data.travelerName} 외 {data.travelerCount - 1}명</td>
            </tr>
            <tr>
              <td className="border border-gray-400 bg-gray-100 p-3 font-bold text-center">출장 장소</td>
              <td className="border border-gray-400 p-3" colSpan="3">{data.location}</td>
            </tr>
            <tr>
              <td className="border border-gray-400 bg-gray-100 p-3 font-bold text-center">출장 목적</td>
              <td className="border border-gray-400 p-3" colSpan="3">{data.purpose}</td>
            </tr>
          </tbody>
        </table>
        <div className="mb-6">
          <h3 className="font-bold mb-2 text-sm border-l-4 border-gray-600 pl-2">상세 보고 내용</h3>
          <div className="border border-gray-400 p-4 min-h-[200px] whitespace-pre-wrap text-sm leading-relaxed">{data.content || "내용 없음"}</div>
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
                <td className="border border-gray-400 p-2 text-left">{data.vehicleType === 'personal' ? `개인차량 (${data.distance}km * ${FUEL_RATE_PERSONAL}원)` : `법인차량 (${data.distance}km)`}</td>
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
                <div key={receipt.id} className="border border-gray-300 p-2 break-inside-avoid text-center">
                  <img src={receipt.url} alt="증빙" className="max-w-full max-h-60 mx-auto object-contain" />
                  <p className="text-xs mt-1 text-gray-500">{receipt.name}</p>
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
      <header className="bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg print-hidden sticky top-0 z-20">
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8 py-3 flex flex-col md:flex-row justify-between items-center gap-3">
          <h1 className="text-lg md:text-xl font-bold flex items-center gap-2 cursor-pointer hover:opacity-90 transition" onClick={() => !isAdminLoggedIn && setActiveTab('report')}>
            <FileText size={24} /> HENCE 출장 보고 및 비용 정산
          </h1>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
            
            {/* --- 일반 사용자 / 관리자 수정 모드 헤더 버튼 --- */}
            {activeTab === 'report' && (
              <>
                {/* 초기화 버튼: 관리자 수정 모드에서는 숨김 권장하지만, 원하시면 표시 가능 (여기선 일반 사용자에게만 노출) */}
                {!editingId && (
                  <button onClick={handleResetForm} className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-blue-800 hover:bg-blue-900 rounded-lg text-sm transition text-blue-100">
                    <RefreshCw size={14} /> 초기화
                  </button>
                )}
                
                {/* 제출/수정 버튼 */}
                <button onClick={handleSubmitReport} className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-400 rounded-lg text-sm transition shadow-sm font-bold">
                  {editingId ? <><CheckCircle size={16} /> 수정 완료</> : <><Send size={16} /> 제출하기</>}
                </button>

                {/* 일반 사용자 모드일 때만 관리자 로그인 버튼 표시 */}
                {!isAdminLoggedIn && (
                  <button onClick={() => setIsAdminLoginModalOpen(true)} className="flex-shrink-0 px-4 py-1.5 rounded-lg font-bold text-sm transition bg-blue-900 text-white hover:bg-black flex items-center gap-1 shadow-sm">
                    <Lock size={14} /> 관리자
                  </button>
                )}

                {/* 관리자 수정 모드일 때 취소 버튼 */}
                {isAdminLoggedIn && editingId && (
                  <button onClick={() => { setEditingId(null); setActiveTab('admin'); }} className="flex-shrink-0 px-4 py-1.5 rounded-lg font-bold text-sm transition bg-gray-600 hover:bg-gray-700 flex items-center gap-1 shadow-sm">
                    <XCircle size={14} /> 취소
                  </button>
                )}
              </>
            )}

            {/* --- 미리보기 모드 상단 메뉴 (요청하신 최적화 부분) --- */}
            {!isAdminLoggedIn && activeTab === 'preview' && (
              <>
                 <button onClick={handleEditContent} className="flex-shrink-0 px-4 py-1.5 rounded-lg font-bold text-sm transition bg-white text-blue-700 hover:bg-blue-50 flex items-center gap-1 shadow-sm border border-blue-200">
                  <Edit3 size={16} /> 내용 수정
                </button>
                <button onClick={handleSubmitReport} className="flex-shrink-0 flex items-center gap-1 px-4 py-1.5 bg-blue-500 hover:bg-blue-400 rounded-lg text-sm transition shadow-sm font-bold border border-blue-400">
                  <Send size={16} /> 제출하기
                </button>
              </>
            )}

            {/* --- 관리자 모드 버튼 (대시보드 보기) --- */}
            {isAdminLoggedIn && activeTab !== 'report' && (
              <button onClick={() => { setActiveTab('admin'); setSelectedReport(null); }} className={`flex-shrink-0 px-4 py-1.5 rounded-lg font-medium transition flex items-center gap-1 ${activeTab === 'admin' ? 'bg-white text-blue-700' : 'bg-blue-800 text-white'}`}>
                <UserCog size={18} /> 관리자 모드
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="w-full max-w-[1920px] mx-auto p-4 md:p-8 print:p-0">
        {/* 작성 폼: 일반 사용자 작성 모드 OR 관리자 수정 모드일 때 표시 */}
        {activeTab === 'report' && (
          <div className="animate-fade-in print-hidden">
            {/* 3단 레이아웃 그리드 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
              
              {/* [1열] 기본 정보 */}
              <div className="space-y-6 h-full">
                <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-full hover:shadow-lg transition duration-300">
                  <h2 className="text-lg font-bold mb-5 flex items-center gap-2 border-b pb-3 text-gray-800">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Calendar size={20} /></div>
                    출장 기본 정보
                  </h2>
                  <div className="grid grid-cols-1 gap-5">
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">시작일</label>
                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">종료일</label>
                        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">출장자 성명</label>
                      <input type="text" name="travelerName" placeholder="홍길동" value={formData.travelerName} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">출장 인원 (명)</label>
                      <input type="number" name="travelerCount" min="1" value={formData.travelerCount} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" />
                    </div>
                  </div>
                </section>
              </div>

              {/* [2열] 장소 및 상세 내용 */}
              <div className="space-y-6 h-full">
                 <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-full hover:shadow-lg transition duration-300">
                  <h2 className="text-lg font-bold mb-5 flex items-center gap-2 border-b pb-3 text-gray-800">
                    <div className="p-2 bg-green-100 rounded-lg text-green-600"><MapPin size={20} /></div>
                    장소 및 내용
                  </h2>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">출장 장소</label>
                      <input type="text" name="location" placeholder="예: 서울시 강남구 본사" value={formData.location} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">출장 목적</label>
                      <input type="text" name="purpose" placeholder="예: 프로젝트 킥오프" value={formData.purpose} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition" />
                    </div>
                    <div className="flex-grow">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">상세 보고 내용</label>
                      <textarea name="content" rows="8" placeholder="주요 협의 내용 및 결과 요약..." value={formData.content} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none transition h-[180px]"></textarea>
                    </div>
                  </div>
                </section>
              </div>

              {/* [3열] 경비 정산 (교통 + 경비) */}
              <div className="space-y-6 h-full flex flex-col">
                 <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition duration-300 flex-grow">
                  <h2 className="text-lg font-bold mb-5 flex items-center gap-2 border-b pb-3 text-gray-800">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><DollarSign size={20} /></div>
                    비용 정산
                  </h2>
                  
                  {/* 교통비 */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-1"><Car size={16}/> 교통수단</h3>
                    <div className="space-y-3">
                      <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white">
                        <option value="company">법인 차량 (유류비 미지급)</option>
                        <option value="personal">개인 차량 (유류비 지급)</option>
                      </select>
                      <div className="flex items-center gap-2">
                         <input type="number" name="distance" placeholder="운행거리" value={formData.distance} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-purple-500 outline-none" />
                         <span className="text-sm text-gray-500 whitespace-nowrap">km</span>
                      </div>
                      <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200 mt-2">
                        <span className="text-gray-500">유류비 산출</span>
                        <span className="font-bold text-purple-700 text-lg">{formatCurrency(formData.fuelCost)}</span>
                      </div>
                    </div>
                  </div>

                  {/* 지출 경비 */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-1"><DollarSign size={16}/> 지출 내역</h3>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                      {formData.expenses.map((expense) => (
                        <div key={expense.id} className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 relative group">
                          <div className="flex gap-2">
                            <select value={expense.category} onChange={(e) => handleExpenseChange(expense.id, 'category', e.target.value)} className="p-2 border rounded-md text-sm w-1/3 focus:ring-1 focus:ring-purple-500">
                              <option>식비</option><option>숙박비</option><option>통행료</option><option>접대비</option><option>기타</option>
                            </select>
                            <input type="number" placeholder="금액" value={expense.amount} onChange={(e) => handleExpenseChange(expense.id, 'amount', e.target.value)} className="p-2 border rounded-md text-sm w-2/3 text-right focus:ring-1 focus:ring-purple-500" />
                          </div>
                          <input type="text" placeholder="상세 내용" value={expense.description} onChange={(e) => handleExpenseChange(expense.id, 'description', e.target.value)} className="p-2 border rounded-md text-sm w-full focus:ring-1 focus:ring-purple-500" />
                          <button onClick={() => removeExpense(expense.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"><Trash2 size={16}/></button>
                        </div>
                      ))}
                    </div>
                    <button onClick={addExpense} className="mt-3 w-full py-2 border-2 border-dashed border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-1 font-medium text-sm">
                      <Plus size={16} /> 항목 추가
                    </button>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                      <span className="font-bold text-gray-700">총 청구 금액</span>
                      <span className="text-2xl font-black text-blue-700">{formatCurrency(calculateTotal())}</span>
                    </div>
                  </div>
                </section>
              </div>

              {/* [하단 전체] 증빙 자료 */}
              <div className="col-span-1 lg:col-span-2 xl:col-span-3">
                 <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition duration-300">
                  <h2 className="text-lg font-bold mb-5 flex items-center gap-2 border-b pb-3 text-gray-800">
                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Upload size={20} /></div>
                    증빙 자료 (영수증)
                  </h2>
                  <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 bg-orange-50 p-4 rounded-lg border border-orange-100">
                    <label className="cursor-pointer bg-white border border-orange-200 text-orange-700 hover:bg-orange-50 px-6 py-2.5 rounded-lg shadow-sm flex items-center gap-2 transition w-full sm:w-auto justify-center font-bold">
                      <Upload size={18} /> 사진 업로드
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                    <span className="text-sm text-gray-500 text-center sm:text-left">※ 영수증, 티켓 등 증빙할 수 있는 이미지 파일을 첨부해주세요.</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    {formData.receipts.map(receipt => (
                      <div key={receipt.id} className="relative group border-2 border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-white aspect-[3/4]">
                        <img src={receipt.url} alt="Receipt" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center">
                          <button onClick={() => removeReceipt(receipt.id)} className="bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition shadow-lg">
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <p className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 text-xs p-1 truncate text-center font-medium border-t">{receipt.name}</p>
                      </div>
                    ))}
                    {formData.receipts.length === 0 && (
                      <div className="col-span-full py-8 text-center text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <p>첨부된 이미지가 없습니다.</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* 작성 완료 버튼 */}
              <div className="col-span-1 lg:col-span-2 xl:col-span-3 flex justify-center py-6">
                <button onClick={() => { setActiveTab('preview'); setSelectedReport(formData); }} className="w-full md:w-1/3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-xl hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                  <CheckCircle size={24} /> {editingId ? '수정 완료 및 미리보기' : '작성 완료 및 미리보기'}
                </button>
              </div>

            </div>
          </div>
        )}
        {activeTab === 'preview' && selectedReport && renderPreview(selectedReport)}
        {activeTab === 'admin' && isAdminLoggedIn && <AdminDashboard reports={submittedReports} onViewReport={handleViewReport} onChangePassword={() => setIsPasswordChangeModalOpen(true)} onLogout={handleAdminLogout} />}
        {isAdminLoginModalOpen && <AdminLoginModal onClose={() => setIsAdminLoginModalOpen(false)} onLogin={handleAdminLogin} />}
        {isPasswordChangeModalOpen && adminCredentials && <PasswordChangeModal onClose={() => setIsPasswordChangeModalOpen(false)} adminCredentials={adminCredentials} />}
      </main>
    </div>
  );
}