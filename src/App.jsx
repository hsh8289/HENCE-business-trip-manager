import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, FileText, DollarSign, Car, Upload, Printer, Trash2, Plus, Save, Lock, LogOut, UserCog, RefreshCw, Check, Send, Edit, X, Users, AlertCircle, MessageSquare, LogIn } from 'lucide-react';

// 유류비 기준 단가 (원/km)
const FUEL_RATE_PERSONAL = 200; 

// 초기 데이터 반환 함수
function getInitialFormData() {
  return {
    startDate: '', 
    endDate: '', 
    travelerName: '', 
    travelerCount: 1, 
    location: '', 
    purpose: '', 
    content: '', 
    vehicleType: 'company', 
    distance: 0, 
    fuelCost: 0,
    expenses: [{ id: 1, category: '식비', description: '점심 식사', amount: 0 }], 
    receipts: []
  };
}

// ----------------------------------------------------------------------
// [컴포넌트] 로그인 모달 (팝업 형태)
// ----------------------------------------------------------------------
function LoginModal({ onClose, onLogin }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [{ id: 'admin', password: 'admin', name: '관리자', role: 'admin' }];
    const user = users.find(u => u.id === userId && u.password === password);
    
    if (user) {
      onLogin(user);
      onClose();
    } else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24}/></button>
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Lock size={32} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">로그인</h2>
          <p className="text-gray-500 mt-2 text-sm">보고서 작성 및 관리를 위해 로그인해주세요.</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-lg border border-red-100 flex items-center gap-2"><AlertCircle size={16}/>{error}</div>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
            <input 
              type="text" 
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="아이디 입력"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="비밀번호 입력"
            />
          </div>
          <button 
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg mt-2"
          >
            로그인
          </button>
        </div>
        <div className="mt-6 text-center text-sm text-gray-400">
          * 초기 관리자: admin / admin
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// [컴포넌트] 기타 모달들
// ----------------------------------------------------------------------
function RejectModal({ onClose, onConfirm }) {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
        <h3 className="text-lg font-bold mb-4 text-red-600 flex items-center gap-2"><X size={20}/> 반려 사유 작성</h3>
        <textarea 
          className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-red-500 outline-none mb-4"
          placeholder="반려 사유를 입력하세요..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium">취소</button>
          <button onClick={() => onConfirm(reason)} className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold">반려하기</button>
        </div>
      </div>
    </div>
  );
}

function ResubmitCommentModal({ onClose, onConfirm }) {
  const [comment, setComment] = useState('');
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
        <h3 className="text-lg font-bold mb-4 text-blue-600 flex items-center gap-2"><MessageSquare size={20}/> 재기안 코멘트</h3>
        <p className="text-sm text-gray-500 mb-2">수정된 사항을 간단히 적어주세요.</p>
        <textarea 
          className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-500 outline-none mb-4"
          placeholder="예: 지출 내역 금액 수정 완료"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium">취소</button>
          <button onClick={() => onConfirm(comment)} className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold">제출하기</button>
        </div>
      </div>
    </div>
  );
}

function UserManagementModal({ onClose }) {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ id: '', password: '', name: '', role: 'employee' });

  useEffect(() => {
    const loadedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(loadedUsers);
  }, []);

  const saveUsers = (updatedUsers) => {
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleAddUser = () => {
    if (!newUser.id || !newUser.password || !newUser.name) return alert('모든 정보를 입력해주세요.');
    if (users.some(u => u.id === newUser.id)) return alert('이미 존재하는 아이디입니다.');
    saveUsers([...users, newUser]);
    setNewUser({ id: '', password: '', name: '', role: 'employee' });
  };

  const handleDeleteUser = (id) => {
    if (id === 'admin') return alert('최고 관리자 계정은 삭제할 수 없습니다.');
    if (confirm('정말 삭제하시겠습니까?')) {
      saveUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2"><Users className="text-blue-600"/> 계정 관리</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} className="text-gray-500"/></button>
        </div>
        <div className="flex flex-col md:flex-row gap-2 mb-6 p-4 bg-gray-50 rounded-lg">
          <input placeholder="아이디" value={newUser.id} onChange={e => setNewUser({...newUser, id: e.target.value})} className="p-2 border rounded flex-1"/>
          <input placeholder="비밀번호" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="p-2 border rounded flex-1"/>
          <input placeholder="이름" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="p-2 border rounded flex-1"/>
          <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="p-2 border rounded">
            <option value="employee">직원</option>
            <option value="admin">관리자</option>
          </select>
          <button onClick={handleAddUser} className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 whitespace-nowrap">등록</button>
        </div>
        <div className="flex-1 overflow-auto border rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 sticky top-0">
              <tr><th className="p-3">이름</th><th className="p-3">아이디</th><th className="p-3">비밀번호</th><th className="p-3">권한</th><th className="p-3 text-center">관리</th></tr>
            </thead>
            <tbody className="divide-y">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="p-3">{u.name}</td><td className="p-3 text-gray-500">{u.id}</td><td className="p-3 font-mono">****</td>
                  <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{u.role === 'admin' ? '관리자' : '직원'}</span></td>
                  <td className="p-3 text-center">{u.id !== 'admin' && <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// [메인] App 컴포넌트
// ----------------------------------------------------------------------
export default function App() {
  const [user, setUser] = useState(null); // 로그인 상태 (null이면 게스트)
  const [view, setView] = useState('dashboard');
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  
  // 모달 상태
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showResubmitModal, setShowResubmitModal] = useState(false);
  const [showUserManageModal, setShowUserManageModal] = useState(false);
  const [rejectionNotification, setRejectionNotification] = useState(null); 

  const [formData, setFormData] = useState(getInitialFormData());
  const [editingId, setEditingId] = useState(null);

  // 초기 데이터 로드
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (!storedUsers) {
      localStorage.setItem('users', JSON.stringify([{ id: 'admin', password: 'admin', name: '관리자', role: 'admin' }]));
    }
    const storedReports = localStorage.getItem('reports');
    if (storedReports) {
      setReports(JSON.parse(storedReports));
    }
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setFormData(prev => ({ ...prev, travelerName: loggedInUser.name }));
    if (loggedInUser.role === 'employee') {
      const myReports = JSON.parse(localStorage.getItem('reports') || '[]').filter(r => r.userId === loggedInUser.id);
      const rejected = myReports.find(r => r.status === 'rejected' && !r.checked);
      if (rejected) {
        setRejectionNotification(rejected);
        updateReport(rejected.id, { checked: true });
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView('dashboard');
    setSelectedReport(null);
    setRejectionNotification(null);
    setEditingId(null);
    setFormData(getInitialFormData());
  };

  const saveReportsToStorage = (newReports) => {
    setReports(newReports);
    localStorage.setItem('reports', JSON.stringify(newReports));
  };

  const updateReport = (id, updates) => {
    const updated = reports.map(r => r.id === id ? { ...r, ...updates } : r);
    saveReportsToStorage(updated);
  };

  // --- 작성 기능 ---
  const handleCreateReportClick = () => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      startWrite();
    }
  };

  const startWrite = () => {
    setFormData({ ...getInitialFormData(), travelerName: user ? user.name : '' });
    setSelectedReport(null);
    setEditingId(null);
    setView('write');
  };

  // --- 입력 핸들러들 ---
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
  const removeExpense = (id) => setFormData(prev => ({ ...prev, expenses: prev.expenses.filter(e => e.id !== id) }));
  const handleExpenseChange = (id, field, value) => {
    setFormData(prev => ({ ...prev, expenses: prev.expenses.map(e => e.id === id ? { ...e, [field]: field === 'amount' ? parseInt(value) || 0 : value } : e) }));
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, receipts: [...prev.receipts, { id: Date.now(), name: file.name, url: reader.result }] }));
      reader.readAsDataURL(file);
    }
  };
  const removeReceipt = (id) => setFormData(prev => ({ ...prev, receipts: prev.receipts.filter(r => r.id !== id) }));
  const calculateTotal = (data = formData) => data.expenses.reduce((sum, item) => sum + item.amount, 0) + data.fuelCost;

  // --- 제출/수정/삭제 등 액션 ---
  const submitReport = (comment = '') => {
    if (!formData.startDate || !formData.endDate) return alert('날짜를 입력해주세요.');
    const newReport = {
      ...formData,
      id: editingId || Date.now(),
      userId: user.id,
      submittedAt: editingId ? formData.submittedAt : new Date().toISOString(),
      status: 'pending', 
      resubmissionComment: comment || formData.resubmissionComment,
      rejectionReason: null 
    };
    let updatedReports;
    if (editingId) {
      updatedReports = reports.map(r => r.id === editingId ? newReport : r);
    } else {
      updatedReports = [newReport, ...reports];
    }
    saveReportsToStorage(updatedReports);
    if (!editingId) localStorage.removeItem('tripReportDraft');
    alert(editingId ? '수정되었습니다.' : '제출되었습니다.');
    setEditingId(null);
    setSelectedReport(null);
    setView('dashboard');
  };

  const handleSubmitClick = () => {
    if (selectedReport && selectedReport.status === 'rejected') {
      setShowResubmitModal(true);
    } else {
      if(confirm(editingId ? '수정된 내용을 저장하시겠습니까?' : '제출하시겠습니까?')) submitReport();
    }
  };

  const handleEdit = (report) => {
    setFormData(report);
    setSelectedReport(report);
    setEditingId(report.id);
    setView('write');
  };

  const handleStartAdminEdit = () => { if (selectedReport) handleEdit(selectedReport); };
  const handleDelete = () => { if(confirm('삭제하시겠습니까?')) { saveReportsToStorage(reports.filter(r => r.id !== selectedReport.id)); alert('삭제되었습니다.'); setView('dashboard'); } };
  const handleApprove = () => { if(confirm('승인하시겠습니까?')) { updateReport(selectedReport.id, { status: 'approved' }); alert('승인되었습니다.'); setView('dashboard'); } };
  const handleRejectClick = () => setShowRejectModal(true);
  const confirmReject = (reason) => { if (!reason) return alert('사유 입력 필요'); updateReport(selectedReport.id, { status: 'rejected', rejectionReason: reason, checked: false }); setShowRejectModal(false); alert('반려되었습니다.'); setView('dashboard'); };
  const handleResetForm = () => { if(window.confirm('초기화하시겠습니까?')) { setFormData({ ...getInitialFormData(), travelerName: user ? user.name : '' }); localStorage.removeItem('tripReportDraft'); } };
  const handleSaveDraft = () => { localStorage.setItem('tripReportDraft', JSON.stringify({ ...formData, receipts: [] })); alert('임시 저장되었습니다.'); };
  const handlePrint = () => window.print();
  const formatCurrency = (num) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(num);

  const StatusBadge = ({ status }) => {
    switch(status) {
      case 'approved': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold border border-green-200">승인</span>;
      case 'rejected': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold border border-red-200">반려</span>;
      default: return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-bold border border-yellow-200">대기</span>;
    }
  };

  const printStyles = `
    @media print { @page { size: A4; margin: 0; } body { margin: 0; padding: 0; background-color: white; -webkit-print-color-adjust: exact; } .print-hidden { display: none !important; } .print-container { width: 210mm; min-height: 297mm; margin: 0; padding: 20mm; box-shadow: none; border: none; page-break-after: always; } }
    .a4-preview-container { width: 210mm; min-height: 297mm; padding: 20mm; margin: 0 auto; background: white; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; }
    @media (max-width: 768px) { .a4-preview-container { width: 100%; padding: 20px; min-height: auto; box-shadow: none; border: none; } }
  `;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans print:bg-white">
      {/* 상단 헤더 */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg print-hidden sticky top-0 z-20">
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-lg md:text-xl font-bold flex items-center gap-2 cursor-pointer hover:opacity-90 transition" onClick={() => setView('dashboard')}>
              <FileText size={24} /> HENCE 출장 보고 및 비용 정산
            </h1>
            {user && <span className="text-sm bg-blue-800 px-3 py-1 rounded-full">{user.role === 'admin' ? '관리자 모드' : `${user.name} 님`}</span>}
          </div>
          <div className="flex gap-2">
            {!user ? (
              <button onClick={() => setShowLoginModal(true)} className="text-sm bg-white text-blue-700 hover:bg-blue-50 px-4 py-1.5 rounded font-bold flex items-center gap-1 transition shadow-sm">
                <LogIn size={14}/> 로그인
              </button>
            ) : (
              <button onClick={handleLogout} className="text-sm bg-blue-800 hover:bg-blue-900 px-3 py-1.5 rounded flex items-center gap-1 transition"><LogOut size={14}/> 로그아웃</button>
            )}
          </div>
        </div>
      </header>

      <main className="w-full max-w-[1920px] mx-auto p-4 md:p-8 print:p-0">
        
        {/* --- [대시보드] --- */}
        {view === 'dashboard' && (
          <div className="animate-fade-in space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                {user?.role === 'admin' ? <><UserCog className="text-blue-600"/> 관리자 대시보드</> : <><FileText className="text-blue-600"/> {user ? '나의 보고서 관리' : '보고서 목록'}</>}
              </h2>
              <div className="flex gap-2">
                {user?.role === 'admin' && (
                  <button onClick={() => setShowUserManageModal(true)} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-bold flex items-center gap-2 shadow-sm transition">
                    <Users size={18}/> 계정 관리
                  </button>
                )}
                <button onClick={handleCreateReportClick} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-bold flex items-center gap-2 shadow-md transition">
                  <Plus size={18}/> 새 보고서 작성
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-5 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                  <FileText size={20} className="text-gray-500"/> {user?.role === 'admin' ? '전체 제출된 보고서' : (user ? '나의 제출 이력' : '보고서 제출 이력 (로그인 필요)')}
                </h3>
                {user && <span className="text-sm text-gray-500">총 {(user.role === 'admin' ? reports : reports.filter(r => r.userId === user.id)).length}건</span>}
              </div>
              <div className="overflow-x-auto">
                {!user ? (
                  <div className="p-16 text-center text-gray-400">
                    <Lock size={48} className="mx-auto mb-4 text-gray-300"/>
                    <p className="text-lg font-bold">보고서 내역을 보려면 로그인이 필요합니다.</p>
                    <button onClick={() => setShowLoginModal(true)} className="mt-4 text-blue-600 font-bold hover:underline">로그인하기</button>
                  </div>
                ) : (
                  <table className="w-full text-sm text-left text-gray-600 min-w-[800px]">
                    <thead className="bg-gray-100 text-gray-700 uppercase font-bold text-xs border-b">
                      <tr><th className="px-6 py-4">상태</th><th className="px-6 py-4">제출일</th><th className="px-6 py-4">작성자</th><th className="px-6 py-4">출장지</th><th className="px-6 py-4">기간</th><th className="px-6 py-4 text-center">관리</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(user.role === 'admin' ? reports : reports.filter(r => r.userId === user.id)).map((report) => (
                        <tr key={report.id} className="hover:bg-blue-50 transition-colors">
                          <td className="px-6 py-4"><StatusBadge status={report.status} /></td>
                          <td className="px-6 py-4 text-gray-500">{new Date(report.submittedAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 font-bold text-gray-900">{report.travelerName}</td>
                          <td className="px-6 py-4 truncate max-w-[200px]">{report.location}</td>
                          <td className="px-6 py-4 text-gray-500">{report.startDate} ~ {report.endDate}</td>
                          <td className="px-6 py-4 text-center">
                            <button onClick={() => { setSelectedReport(report); setView('preview'); }} className="bg-white border border-blue-200 text-blue-600 px-3 py-1 rounded hover:bg-blue-50 font-bold text-xs shadow-sm">상세보기</button>
                            {/* [추가] 대기 상태일 때 바로 수정 버튼 표시 (직원용) */}
                            {user.role === 'employee' && report.status === 'pending' && (
                              <button onClick={() => handleEdit(report)} className="ml-2 bg-white border border-green-200 text-green-600 px-3 py-1 rounded hover:bg-green-50 font-bold text-xs shadow-sm">수정</button>
                            )}
                          </td>
                        </tr>
                      ))}
                      {(user.role === 'admin' ? reports : reports.filter(r => r.userId === user.id)).length === 0 && (
                        <tr><td colSpan="6" className="text-center py-16 text-gray-400">제출된 보고서가 없습니다.</td></tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- [작성/수정] --- */}
        {view === 'write' && (
          <div className="animate-fade-in pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
              {/* 1열 */}
              <div className="space-y-6 h-full">
                <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-full">
                  <h2 className="text-lg font-bold mb-5 flex items-center gap-2 border-b pb-3 text-gray-800"><div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Calendar size={20} /></div>출장 기본 정보</h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className="block text-sm font-semibold mb-1">시작일</label><input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full p-2.5 border rounded-lg"/></div>
                    <div><label className="block text-sm font-semibold mb-1">종료일</label><input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full p-2.5 border rounded-lg"/></div>
                  </div>
                  <div className="mb-4"><label className="block text-sm font-semibold mb-1">출장자 성명</label><input type="text" name="travelerName" value={formData.travelerName} onChange={handleChange} className="w-full p-2.5 border rounded-lg" readOnly={user?.role === 'employee'}/></div>
                  <div><label className="block text-sm font-semibold mb-1">인원 (명)</label><input type="number" name="travelerCount" value={formData.travelerCount} onChange={handleChange} className="w-full p-2.5 border rounded-lg"/></div>
                </section>
              </div>
              {/* 2열 */}
              <div className="space-y-6 h-full">
                <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-full">
                  <h2 className="text-lg font-bold mb-5 flex items-center gap-2 border-b pb-3 text-gray-800"><div className="p-2 bg-green-100 rounded-lg text-green-600"><MapPin size={20} /></div>장소 및 내용</h2>
                  <div className="mb-4"><label className="block text-sm font-semibold mb-1">출장 장소</label><input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full p-2.5 border rounded-lg"/></div>
                  <div className="mb-4"><label className="block text-sm font-semibold mb-1">출장 목적</label><input type="text" name="purpose" value={formData.purpose} onChange={handleChange} className="w-full p-2.5 border rounded-lg"/></div>
                  <div><label className="block text-sm font-semibold mb-1">상세 내용</label><textarea name="content" rows="8" value={formData.content} onChange={handleChange} className="w-full p-2.5 border rounded-lg resize-none"></textarea></div>
                </section>
              </div>
              {/* 3열 */}
              <div className="space-y-6 h-full flex flex-col">
                <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex-grow">
                  <h2 className="text-lg font-bold mb-5 flex items-center gap-2 border-b pb-3 text-gray-800"><div className="p-2 bg-purple-100 rounded-lg text-purple-600"><DollarSign size={20} /></div>비용 정산</h2>
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-1"><Car size={16}/> 교통수단</h3>
                    <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="w-full p-2.5 border rounded-lg mb-2 bg-white"><option value="company">법인 차량</option><option value="personal">개인 차량</option></select>
                    <div className="flex items-center gap-2"><input type="number" name="distance" placeholder="거리" value={formData.distance} onChange={handleChange} className="w-full p-2.5 border rounded-lg text-right"/><span className="text-sm">km</span></div>
                    <div className="flex justify-between items-center text-sm pt-2 mt-2"><span className="text-gray-500">유류비</span><span className="font-bold text-purple-700 text-lg">{formatCurrency(formData.fuelCost)}</span></div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-1"><DollarSign size={16}/> 지출 내역</h3>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                      {formData.expenses.map((expense) => (
                        <div key={expense.id} className="flex gap-2 p-2 bg-gray-50 rounded border relative group">
                          <select value={expense.category} onChange={(e) => handleExpenseChange(expense.id, 'category', e.target.value)} className="p-1 border rounded text-sm w-1/4"><option>식비</option><option>숙박비</option><option>교통비</option><option>기타</option></select>
                          <input type="text" placeholder="내용" value={expense.description} onChange={(e) => handleExpenseChange(expense.id, 'description', e.target.value)} className="p-1 border rounded text-sm flex-1"/>
                          <input type="number" placeholder="금액" value={expense.amount} onChange={(e) => handleExpenseChange(expense.id, 'amount', e.target.value)} className="p-1 border rounded text-sm w-1/4 text-right"/>
                          <button onClick={() => removeExpense(expense.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                        </div>
                      ))}
                    </div>
                    <button onClick={addExpense} className="mt-3 w-full py-2 border-2 border-dashed text-blue-600 rounded-lg hover:bg-blue-50 flex justify-center items-center gap-1 text-sm font-bold"><Plus size={16}/> 항목 추가</button>
                    <div className="mt-4 pt-4 border-t flex justify-between items-center"><span className="font-bold text-gray-700">총 청구 금액</span><span className="text-2xl font-black text-blue-700">{formatCurrency(calculateTotal())}</span></div>
                  </div>
                </section>
              </div>
              {/* 증빙 자료 */}
              <div className="col-span-1 lg:col-span-2 xl:col-span-3">
                <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <h2 className="text-lg font-bold mb-5 flex items-center gap-2 border-b pb-3 text-gray-800"><div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Upload size={20} /></div>증빙 자료</h2>
                  <div className="flex items-center gap-4 mb-4"><label className="cursor-pointer bg-white border border-orange-200 text-orange-700 hover:bg-orange-50 px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Upload size={18}/> 사진 업로드<input type="file" accept="image/*" className="hidden" onChange={handleFileUpload}/></label><span className="text-sm text-gray-500">영수증 등을 첨부하세요.</span></div>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {formData.receipts.map(r => (<div key={r.id} className="relative group border rounded overflow-hidden aspect-[3/4]"><img src={r.url} className="w-full h-full object-cover"/><button onClick={() => removeReceipt(r.id)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"><Trash2 size={14}/></button></div>))}
                  </div>
                </section>
              </div>
            </div>
            
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-center gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10">
              <button onClick={() => setView('dashboard')} className="px-6 py-3 rounded-xl font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition">취소</button>
              <button onClick={handleSubmitClick} className="px-8 py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition flex items-center gap-2">
                {editingId ? <><Edit size={18}/> 수정 완료 및 제출</> : <><Check size={18}/> 작성 완료 및 제출</>}
              </button>
            </div>
          </div>
        )}

        {/* --- [미리보기] --- */}
        {view === 'preview' && selectedReport && (
          <div className="bg-gray-100 min-h-screen p-4 md:p-8 print:bg-white print:p-0">
            <style>{printStyles}</style>
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center print-hidden gap-4">
              <button onClick={() => setView('dashboard')} className="text-gray-600 hover:text-gray-900 font-bold flex items-center gap-1">&larr; 목록으로</button>
              <div className="flex gap-2">
                {user?.role === 'admin' && (
                  <>
                    <button onClick={handleDelete} className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded shadow hover:bg-red-50 font-bold flex items-center gap-2"><Trash2 size={16}/> 삭제</button>
                    {selectedReport.status !== 'approved' && (
                      <>
                        <button onClick={handleRejectClick} className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 font-bold flex items-center gap-2"><X size={16}/> 반려</button>
                        <button onClick={handleApprove} className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 font-bold flex items-center gap-2"><Check size={16}/> 승인</button>
                      </>
                    )}
                  </>
                )}
                {/* [수정] 대기(pending) 상태이거나 반려(rejected) 상태일 때 수정 버튼 표시 */}
                {user?.role === 'employee' && (selectedReport.status === 'rejected' || selectedReport.status === 'pending') && (
                  <button onClick={() => handleEdit(selectedReport)} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 font-bold flex items-center gap-2"><Edit size={16}/> {selectedReport.status === 'rejected' ? '수정 및 재제출' : '내용 수정'}</button>
                )}
                <button onClick={handlePrint} className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-gray-900 font-bold flex items-center gap-2"><Printer size={16}/> 인쇄</button>
              </div>
            </div>

            {/* 반려 사유 (화면 표시용) */}
            {selectedReport.status === 'rejected' && selectedReport.rejectionReason && (
              <div className="max-w-[210mm] mx-auto mb-6 bg-red-50 border border-red-200 p-4 rounded-lg flex items-start gap-3 print-hidden">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-1"/>
                <div><h4 className="font-bold text-red-700">관리자 반려 사유</h4><p className="text-red-600 text-sm mt-1">{selectedReport.rejectionReason}</p></div>
              </div>
            )}
            
            {/* A4 서식 (내용 생략 없이 그대로 유지) */}
            <div className="a4-preview-container print-container relative">
              {selectedReport.status === 'approved' && <div className="absolute top-10 right-10 border-4 border-green-600 text-green-600 rounded-full w-32 h-32 flex items-center justify-center transform rotate-[-15deg] opacity-80 pointer-events-none"><div className="text-center"><div className="text-sm font-bold border-b border-green-600 pb-1 mb-1">{new Date().toLocaleDateString()}</div><div className="text-2xl font-black">승 인</div><div className="text-xs font-bold mt-1">HENCE 관리자</div></div></div>}
              {selectedReport.status === 'rejected' && <div className="absolute top-10 right-10 border-4 border-red-600 text-red-600 rounded-full w-32 h-32 flex items-center justify-center transform rotate-[-15deg] opacity-80 pointer-events-none"><div className="text-2xl font-black">반 려</div></div>}
              <h1 className="text-3xl font-bold text-center mb-10 underline decoration-4 decoration-gray-300 underline-offset-8">출 장 보 고 서</h1>

              {/* [추가] 재기안 코멘트를 A4 보고서 내부 상단에 포함 */}
              {selectedReport.resubmissionComment && (
                <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-800 rounded-r text-sm">
                   <h4 className="font-bold flex items-center gap-2 mb-1"><MessageSquare size={16}/> 재기안 수정 사유</h4>
                   <p>{selectedReport.resubmissionComment}</p>
                </div>
              )}

              <div className="flex justify-end mb-8 text-center text-sm">
                <table className="border-collapse border border-gray-400"><tbody><tr><td className="border bg-gray-100 p-1 w-20">담당</td><td className="border bg-gray-100 p-1 w-20">팀장</td><td className="border bg-gray-100 p-1 w-20">부서장</td></tr><tr><td className="border h-20 align-middle font-bold text-gray-400">{selectedReport.travelerName.slice(0,1)}인</td><td className="border h-20"></td><td className="border h-20 align-middle text-green-600 font-bold">{selectedReport.status === 'approved' ? '승인' : ''}</td></tr></tbody></table>
              </div>
              <table className="w-full border-collapse border border-gray-400 mb-6 text-sm">
                <tbody>
                  <tr><td className="border bg-gray-100 p-3 font-bold w-1/5 text-center">출장 기간</td><td className="border p-3 w-2/5">{selectedReport.startDate} ~ {selectedReport.endDate}</td><td className="border bg-gray-100 p-3 font-bold w-1/5 text-center">출장자</td><td className="border p-3 w-1/5 text-center">{selectedReport.travelerName} 외 {selectedReport.travelerCount-1}명</td></tr>
                  <tr><td className="border bg-gray-100 p-3 font-bold text-center">출장 장소</td><td className="border p-3" colSpan="3">{selectedReport.location}</td></tr>
                  <tr><td className="border bg-gray-100 p-3 font-bold text-center">출장 목적</td><td className="border p-3" colSpan="3">{selectedReport.purpose}</td></tr>
                </tbody>
              </table>
              <div className="mb-6"><h3 className="font-bold mb-2 text-sm border-l-4 border-gray-600 pl-2">상세 보고 내용</h3><div className="border p-4 min-h-[150px] whitespace-pre-wrap text-sm">{selectedReport.content}</div></div>
              <div className="mb-6">
                <h3 className="font-bold mb-2 text-sm border-l-4 border-gray-600 pl-2">경비 정산 내역</h3>
                <table className="w-full border-collapse border border-gray-400 text-sm text-center">
                  <thead><tr className="bg-gray-100"><th className="border p-2">구분</th><th className="border p-2">내역</th><th className="border p-2">금액</th><th className="border p-2">비고</th></tr></thead>
                  <tbody>
                    <tr><td className="border p-2">교통/유류비</td><td className="border p-2 text-left">{selectedReport.vehicleType === 'personal' ? `개인차량 (${selectedReport.distance}km * ${FUEL_RATE_PERSONAL}원)` : `법인차량 (${selectedReport.distance}km)`}</td><td className="border p-2 text-right">{formatCurrency(selectedReport.fuelCost)}</td><td className="border p-2 text-gray-500">{selectedReport.vehicleType === 'personal'?'':'법인카드'}</td></tr>
                    {selectedReport.expenses.map(e => (<tr key={e.id}><td className="border p-2">{e.category}</td><td className="border p-2 text-left">{e.description}</td><td className="border p-2 text-right">{formatCurrency(e.amount)}</td><td className="border p-2"></td></tr>))}
                    <tr className="bg-gray-50 font-bold"><td className="border p-2" colSpan="2">합 계</td><td className="border p-2 text-right text-blue-600">{formatCurrency(calculateTotal(selectedReport))}</td><td className="border p-2"></td></tr>
                  </tbody>
                </table>
              </div>
              {selectedReport.receipts.length > 0 && <div><h3 className="font-bold mb-2 text-sm border-l-4 border-gray-600 pl-2">증빙 자료</h3><div className="grid grid-cols-2 gap-4">{selectedReport.receipts.map(r => (<div key={r.id} className="border p-2 text-center break-inside-avoid"><img src={r.url} className="max-h-60 mx-auto object-contain"/><p className="text-xs mt-1 text-gray-500">{r.name}</p></div>))}</div></div>}
              <div className="mt-12 text-center"><p className="text-sm text-gray-500">위와 같이 출장 결과를 보고하며 경비를 청구합니다.</p><p className="mt-4 font-bold">{new Date().getFullYear()}년 {new Date().getMonth()+1}월 {new Date().getDate()}일</p><p className="mt-2 font-bold">신청자 : {selectedReport.travelerName} (인)</p></div>
            </div>
          </div>
        )}

        {/* 모달들 */}
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />}
        {showRejectModal && <RejectModal onClose={() => setShowRejectModal(false)} onConfirm={confirmReject} />}
        {showResubmitModal && <ResubmitCommentModal onClose={() => setShowResubmitModal(false)} onConfirm={(comment) => { setShowResubmitModal(false); if(confirm('제출하시겠습니까?')) submitReport(comment); }} />}
        {showUserManageModal && <UserManagementModal onClose={() => setShowUserManageModal(false)} />}
        {rejectionNotification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm border-l-4 border-red-500 animate-bounce-in">
              <h3 className="text-lg font-bold text-red-600 mb-2 flex items-center gap-2"><AlertCircle/> 보고서 반려 알림</h3>
              <p className="mb-4"><strong>{new Date(rejectionNotification.submittedAt).toLocaleDateString()}</strong>에 제출한 보고서가 반려되었습니다.</p>
              <div className="bg-red-50 p-3 rounded text-sm text-red-700 mb-4"><strong>사유:</strong> {rejectionNotification.rejectionReason}</div>
              <button onClick={() => setRejectionNotification(null)} className="w-full bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700">확인</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}