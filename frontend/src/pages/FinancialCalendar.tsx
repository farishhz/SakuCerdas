import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { transactionService } from '../lib/services';

const FinancialCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [transactions, setTransactions] = useState<any[]>([]);

  const fetchTransactions = async () => {
    try {
      // Fetch for the current month
      const data = await transactionService.getAll({
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear()
      });
      setTransactions(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentDate]);

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const renderHeader = () => {
    const monthName = currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
    return (
      <div className="top-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div className="header-badge"><CalendarIcon size={12} /> Kalender</div>
          <h1>Kalender Finansial</h1>
          <p>Lihat ritme pengeluaran dan pemasukanmu bulan ini.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button className="btn btn-ghost" onClick={prevMonth}><ChevronLeft size={20} /></button>
          <span style={{ fontWeight: 700, minWidth: '150px', textAlign: 'center', fontSize: '1.1rem' }}>{monthName}</span>
          <button className="btn btn-ghost" onClick={nextMonth}><ChevronRight size={20} /></button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    return (
      <div className="calendar-grid-header" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '0.5rem' }}>
        {days.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{d}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const count = daysInMonth(month, year);
    const start = firstDayOfMonth(month, year);
    
    const cells = [];
    // Padding for prev month
    for (let i = 0; i < start; i++) {
      cells.push(<div key={`pad-${i}`} className="calendar-cell empty" />);
    }

    for (let day = 1; day <= count; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayTransactions = transactions.filter(t => t.date.startsWith(dateStr));
      const dailyIn = dayTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const dailyOut = dayTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      
      const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
      const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;

      cells.push(
        <div 
          key={day} 
          className={`calendar-cell ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`} 
          onClick={() => setSelectedDate(new Date(year, month, day))}
          style={{ 
            aspectRatio: '1/1', 
            background: isSelected ? 'var(--accent-grad)' : 'rgba(255,255,255,0.03)',
            border: isSelected ? 'none' : '1px solid var(--border)',
            borderRadius: '0.75rem',
            padding: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'all 0.2s',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: isSelected ? 'white' : '' }}>{day}</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {dailyIn > 0 && <div style={{ height: '4px', width: '100%', background: isSelected ? 'rgba(255,255,255,0.4)' : 'var(--success)', borderRadius: '2px' }} />}
            {dailyOut > 0 && <div style={{ height: '4px', width: '100%', background: isSelected ? 'rgba(255,255,255,0.4)' : 'var(--danger)', borderRadius: '2px' }} />}
          </div>
        </div>
      );
    }
    
    return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>{cells}</div>;
  };

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const selectedTransactions = transactions.filter(t => t.date.startsWith(selectedDateStr));

  return (
    <div className="animate-enter pb-8">
      {renderHeader()}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        <div className="glass-card">
          {renderDays()}
          {renderCells()}
        </div>

        <div>
          <div className="glass-card" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>
              Detail Hari: {selectedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </h3>
            
            {selectedTransactions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                 <Wallet size={32} className="text-muted" style={{ opacity: 0.3, marginBottom: '1rem' }} />
                 <p className="text-muted">Tidak ada transaksi di tanggal ini.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {selectedTransactions.map(t => (
                  <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                       <div className={`card-icon ${t.type === 'income' ? 'bg-success-dim' : 'bg-danger-dim'}`} style={{ width: '32px', height: '32px' }}>
                          {t.type === 'income' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                       </div>
                       <div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{t.description || t.categories?.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.categories?.name}</div>
                       </div>
                    </div>
                    <div style={{ fontWeight: 700, color: t.type === 'income' ? 'var(--success)' : '' }}>
                      {t.type === 'income' ? '+' : '-'}Rp{t.amount.toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card" style={{ background: 'var(--accent-grad)', border: 'none', color: 'white' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Ringkasan Hari Ini</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.9, fontSize: '0.9rem' }}>
              <span>Total Pemasukan:</span>
              <span style={{ fontWeight: 700 }}>Rp{selectedTransactions.filter(t => t.type === 'income').reduce((s,t) => s+t.amount, 0).toLocaleString('id-ID')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.9, fontSize: '0.9rem', marginTop: '0.4rem' }}>
              <span>Total Pengeluaran:</span>
              <span style={{ fontWeight: 700 }}>Rp{selectedTransactions.filter(t => t.type === 'expense').reduce((s,t) => s+t.amount, 0).toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialCalendar;
