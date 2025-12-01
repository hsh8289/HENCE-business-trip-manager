import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Users,
  MapPin,
  FileText,
  DollarSign,
  Car,
  Upload,
  Printer,
  Trash2,
  Plus,
  Save,
} from 'lucide-react';

// 유류비 기준 단가 (원/km) - 회사 내규에 따라 수정 가능
const FUEL_RATE_PERSONAL = 200;

export default function App() {
  // --- 상태 관리 (State) ---
  const [activeTab, setActiveTab] = useState('report'); // 'report' or 'preview'
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
    receipts: [], // { id, name, url }
  });

  // 로컬 스토리지에서 불러오기 (임시 저장 기능)
  useEffect(() => {
    const savedData = localStorage.getItem('tripReportDraft');
    if (savedData) {
      // JSON 파싱 에러 방지
      try {
        const parsed = JSON.parse(savedData);
        // 이미지는 로컬스토리지 저장 불가(용량제한)로 제외하고 불러옴
        setFormData((prev) => ({ ...prev, ...parsed, receipts: [] }));
      } catch (e) {
        console.error('저장된 데이터를 불러오는 중 오류 발생', e);
      }
    }
  }, []);

  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // 차량 종류나 거리가 바뀌면 유류비 자동 계산
      if (name === 'distance' || name === 'vehicleType') {
        const dist =
          name === 'distance' ? parseFloat(value) || 0 : prev.distance;
        const vType = name === 'vehicleType' ? value : prev.vehicleType;

        if (vType === 'personal') {
          newData.fuelCost = dist * FUEL_RATE_PERSONAL;
        } else {
          newData.fuelCost = 0; // 법인차량은 유류비 청구 0원 (법인카드 사용 가정)
        }
      }
      return newData;
    });
  };

  // 경비 항목 추가/삭제/수정
  const addExpense = () => {
    const newId =
      formData.expenses.length > 0
        ? Math.max(...formData.expenses.map((e) => e.id)) + 1
        : 1;
    setFormData((prev) => ({
      ...prev,
      expenses: [
        ...prev.expenses,
        { id: newId, category: '기타', description: '', amount: 0 },
      ],
    }));
  };

  const removeExpense = (id) => {
    setFormData((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }));
  };

  const handleExpenseChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      expenses: prev.expenses.map((e) =>
        e.id === id
          ? { ...e, [field]: field === 'amount' ? parseInt(value) || 0 : value }
          : e
      ),
    }));
  };

  // 영수증 이미지 핸들러
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        receipts: [
          ...prev.receipts,
          { id: Date.now(), name: file.name, url: imageUrl },
        ],
      }));
    }
  };

  const removeReceipt = (id) => {
    setFormData((prev) => ({
      ...prev,
      receipts: prev.receipts.filter((r) => r.id !== id),
    }));
  };

  // 총 비용 계산
  const calculateTotal = () => {
    const expenseTotal = formData.expenses.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    return expenseTotal + formData.fuelCost;
  };

  // 임시 저장
  const handleSave = () => {
    const dataToSave = { ...formData, receipts: [] }; // 이미지는 제외하고 저장
    localStorage.setItem('tripReportDraft', JSON.stringify(dataToSave));
    alert('작성 내용이 브라우저에 임시 저장되었습니다.');
  };

  // 인쇄 기능
  const handlePrint = () => {
    window.print();
  };

  // --- 렌더링 헬퍼 ---
  const formatCurrency = (num) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* 상단 네비게이션 (인쇄 시 숨김) */}
      <header className="bg-blue-600 text-white p-4 shadow-md print:hidden">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <FileText size={24} /> 출장 보고 및 비용 정산
          </h1>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-400 rounded text-sm transition"
            >
              <Save size={16} /> 임시저장
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`px-4 py-2 rounded font-medium transition ${
                activeTab === 'report'
                  ? 'bg-white text-blue-600'
                  : 'bg-blue-700 text-white'
              }`}
            >
              작성하기
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded font-medium transition ${
                activeTab === 'preview'
                  ? 'bg-white text-blue-600'
                  : 'bg-blue-700 text-white'
              }`}
            >
              미리보기/인쇄
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 print:p-0 print:max-w-none">
        {/* --- 작성 폼 (Tab: report) --- */}
        {activeTab === 'report' && (
          <div className="space-y-6 animate-fade-in print:hidden">
            {/* 1. 기본 정보 */}
            <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b pb-2">
                <Calendar className="text-blue-600" size={20} /> 출장 기본 정보
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    시작일
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    종료일
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    출장자 성명
                  </label>
                  <input
                    type="text"
                    name="travelerName"
                    placeholder="홍길동"
                    value={formData.travelerName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    출장 인원 (명)
                  </label>
                  <input
                    type="number"
                    name="travelerCount"
                    min="1"
                    value={formData.travelerCount}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </section>

            {/* 2. 출장 내용 */}
            <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b pb-2">
                <MapPin className="text-blue-600" size={20} /> 장소 및 내용
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    출장 장소
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="서울시 강남구 삼성동 거래처 본사"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    출장 목적
                  </label>
                  <input
                    type="text"
                    name="purpose"
                    placeholder="신규 프로젝트 킥오프 미팅"
                    value={formData.purpose}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    상세 보고 내용
                  </label>
                  <textarea
                    name="content"
                    rows="5"
                    placeholder="주요 협의 내용 및 결과 요약..."
                    value={formData.content}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  ></textarea>
                </div>
              </div>
            </section>

            {/* 3. 교통 및 유류비 */}
            <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b pb-2">
                <Car className="text-blue-600" size={20} /> 교통수단 및 유류비
                정산
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    차량 구분
                  </label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="company">법인 차량 (유류비 미지급)</option>
                    <option value="personal">개인 차량 (유류비 지급)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    운행 거리 (km)
                  </label>
                  <input
                    type="number"
                    name="distance"
                    placeholder="0"
                    value={formData.distance}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-right"
                  />
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

            {/* 4. 경비 내역 */}
            <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b pb-2">
                <DollarSign className="text-blue-600" size={20} /> 지출 경비
                내역
              </h2>

              <div className="space-y-3 mb-4">
                {formData.expenses.map((expense, index) => (
                  <div
                    key={expense.id}
                    className="flex flex-col md:flex-row gap-2 items-start md:items-center bg-gray-50 p-3 rounded"
                  >
                    <select
                      value={expense.category}
                      onChange={(e) =>
                        handleExpenseChange(
                          expense.id,
                          'category',
                          e.target.value
                        )
                      }
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
                      onChange={(e) =>
                        handleExpenseChange(
                          expense.id,
                          'description',
                          e.target.value
                        )
                      }
                      className="p-2 border rounded flex-grow w-full"
                    />
                    <input
                      type="number"
                      placeholder="금액"
                      value={expense.amount}
                      onChange={(e) =>
                        handleExpenseChange(
                          expense.id,
                          'amount',
                          e.target.value
                        )
                      }
                      className="p-2 border rounded w-full md:w-40 text-right"
                    />
                    <button
                      onClick={() => removeExpense(expense.id)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={addExpense}
                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                <Plus size={16} /> 항목 추가하기
              </button>

              <div className="mt-6 text-right border-t pt-4">
                <p className="text-gray-600">유류비 포함 총 청구 금액</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(calculateTotal())}
                </p>
              </div>
            </section>

            {/* 5. 영수증 첨부 */}
            <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b pb-2">
                <Upload className="text-blue-600" size={20} /> 증빙 자료
                (영수증)
              </h2>
              <div className="flex items-center gap-4 mb-4">
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded flex items-center gap-2 transition">
                  <Upload size={18} /> 사진 업로드
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
                <span className="text-sm text-gray-500">
                  이미지 파일(JPG, PNG)만 가능
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.receipts.map((receipt) => (
                  <div
                    key={receipt.id}
                    className="relative group border rounded-lg overflow-hidden"
                  >
                    <img
                      src={receipt.url}
                      alt="Receipt"
                      className="w-full h-32 object-cover"
                    />
                    <button
                      onClick={() => removeReceipt(receipt.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                    <p className="text-xs p-1 bg-gray-50 truncate">
                      {receipt.name}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex justify-center pt-6">
              <button
                onClick={() => setActiveTab('preview')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 shadow-lg transition"
              >
                작성 완료 및 미리보기
              </button>
            </div>
          </div>
        )}

        {/* --- 미리보기 및 인쇄 화면 (Tab: preview) --- */}
        {(activeTab === 'preview' || activeTab === 'print') && (
          <div className="bg-white shadow-2xl print:shadow-none min-h-[29.7cm] p-8 md:p-12 print:p-0">
            {/* 인쇄용 버튼 영역 */}
            <div className="flex justify-between items-center mb-8 print:hidden border-b pb-4">
              <button
                onClick={() => setActiveTab('report')}
                className="text-gray-600 hover:text-gray-900 underline"
              >
                &larr; 수정하기
              </button>
              <button
                onClick={handlePrint}
                className="bg-gray-800 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-black transition"
              >
                <Printer size={18} /> PDF 저장 / 인쇄
              </button>
            </div>

            {/* 실제 보고서 양식 */}
            <div className="max-w-3xl mx-auto border border-gray-400 p-8 print:border-0 print:p-0 print:w-full">
              <h1 className="text-3xl font-bold text-center mb-10 underline decoration-4 decoration-gray-300 underline-offset-8">
                출 장 보 고 서
              </h1>

              {/* 결재 라인 (예시) */}
              <div className="flex justify-end mb-8 text-center text-sm">
                <table className="border-collapse border border-gray-400">
                  <tbody>
                    <tr>
                      <td className="border border-gray-400 bg-gray-100 p-1 w-16">
                        담당
                      </td>
                      <td className="border border-gray-400 bg-gray-100 p-1 w-16">
                        팀장
                      </td>
                      <td className="border border-gray-400 bg-gray-100 p-1 w-16">
                        부서장
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 h-16"></td>
                      <td className="border border-gray-400 h-16"></td>
                      <td className="border border-gray-400 h-16"></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 기본 정보 테이블 */}
              <table className="w-full border-collapse border border-gray-400 mb-6 text-sm">
                <tbody>
                  <tr>
                    <td className="border border-gray-400 bg-gray-100 p-2 font-bold w-1/5">
                      출장 기간
                    </td>
                    <td className="border border-gray-400 p-2 w-2/5">
                      {formData.startDate} ~ {formData.endDate}
                    </td>
                    <td className="border border-gray-400 bg-gray-100 p-2 font-bold w-1/5">
                      출장자
                    </td>
                    <td className="border border-gray-400 p-2 w-1/5">
                      {formData.travelerName} 외 {formData.travelerCount - 1}명
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 bg-gray-100 p-2 font-bold">
                      출장 장소
                    </td>
                    <td className="border border-gray-400 p-2" colSpan="3">
                      {formData.location}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 bg-gray-100 p-2 font-bold">
                      출장 목적
                    </td>
                    <td className="border border-gray-400 p-2" colSpan="3">
                      {formData.purpose}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* 상세 내용 */}
              <div className="mb-6">
                <h3 className="font-bold mb-2 text-sm border-l-4 border-gray-600 pl-2">
                  상세 보고 내용
                </h3>
                <div className="border border-gray-400 p-4 min-h-[150px] whitespace-pre-wrap text-sm leading-relaxed">
                  {formData.content || '내용 없음'}
                </div>
              </div>

              {/* 경비 정산 내역 */}
              <div className="mb-6">
                <h3 className="font-bold mb-2 text-sm border-l-4 border-gray-600 pl-2">
                  경비 정산 내역
                </h3>
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
                    {/* 유류비 */}
                    <tr>
                      <td className="border border-gray-400 p-2">
                        교통/유류비
                      </td>
                      <td className="border border-gray-400 p-2 text-left">
                        {formData.vehicleType === 'personal'
                          ? `개인차량 (${formData.distance}km * ${FUEL_RATE_PERSONAL}원)`
                          : `법인차량 (${formData.distance}km)`}
                      </td>
                      <td className="border border-gray-400 p-2 text-right">
                        {formatCurrency(formData.fuelCost)}
                      </td>
                      <td className="border border-gray-400 p-2 text-gray-500">
                        {formData.vehicleType === 'personal' ? '' : '법인카드'}
                      </td>
                    </tr>
                    {/* 기타 경비 */}
                    {formData.expenses.map((expense) => (
                      <tr key={expense.id}>
                        <td className="border border-gray-400 p-2">
                          {expense.category}
                        </td>
                        <td className="border border-gray-400 p-2 text-left">
                          {expense.description}
                        </td>
                        <td className="border border-gray-400 p-2 text-right">
                          {formatCurrency(expense.amount)}
                        </td>
                        <td className="border border-gray-400 p-2"></td>
                      </tr>
                    ))}
                    {/* 합계 */}
                    <tr className="bg-gray-50 font-bold">
                      <td className="border border-gray-400 p-2" colSpan="2">
                        합 계
                      </td>
                      <td className="border border-gray-400 p-2 text-right text-blue-600">
                        {formatCurrency(calculateTotal())}
                      </td>
                      <td className="border border-gray-400 p-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 증빙 영수증 */}
              {formData.receipts.length > 0 && (
                <div className="break-before-auto">
                  <h3 className="font-bold mb-2 text-sm border-l-4 border-gray-600 pl-2">
                    증빙 자료
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {formData.receipts.map((receipt) => (
                      <div
                        key={receipt.id}
                        className="border border-gray-300 p-2"
                      >
                        <img
                          src={receipt.url}
                          alt="증빙"
                          className="max-w-full max-h-60 mx-auto object-contain"
                        />
                        <p className="text-center text-xs mt-1 text-gray-500">
                          {receipt.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-12 text-center">
                <p className="text-sm text-gray-500">
                  위와 같이 출장 결과를 보고하며 경비를 청구합니다.
                </p>
                <p className="mt-4 font-bold">
                  {new Date().getFullYear()}년 {new Date().getMonth() + 1}월{' '}
                  {new Date().getDate()}일
                </p>
                <p className="mt-2 font-bold">
                  신청자 : {formData.travelerName} (인)
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
