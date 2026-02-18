import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { LayoutDashboard, Users, TrendingUp, ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AdminAuthModal from '../components/AdminAuthModal';

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false); // New state for second verification
  const navigate = useNavigate();

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Get token from store directly or localStorage
      const store = JSON.parse(localStorage.getItem('pm-resume-storage') || '{}');
      const token = store.state?.token;

      const res = await fetch('/api/admin/dashboard', {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });
      const data = await res.json();
      if (data.success) {
        setStats(data);
      } else {
        setError(data.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVerified) {
        fetchStats();
    }
  }, [isVerified]);

  if (!isVerified) {
      return (
          <div className="min-h-screen bg-fresh-bg">
              <AdminAuthModal 
                isOpen={true} 
                onSuccess={() => setIsVerified(true)} 
                onCancel={() => navigate('/')} 
              />
          </div>
      );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-fresh-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-fresh-border border-t-fresh-main rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-fresh-bg flex items-center justify-center flex-col gap-4">
        <div className="text-red-500 font-bold text-xl">Error: {error}</div>
        <button onClick={fetchStats} className="px-4 py-2 bg-fresh-main border-2 border-fresh-border rounded-lg shadow-cartoon-sm">Retry</button>
      </div>
    );
  }

  // ECharts Options
  const chartOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: '#1E293B',
      borderWidth: 2,
      textStyle: {
        color: '#1E293B',
        fontFamily: 'Nunito',
        fontWeight: 'bold'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: stats.trend.map((t: any) => t.date),
      axisLine: {
        lineStyle: { color: '#1E293B' }
      },
      axisLabel: {
        color: '#64748B',
        fontFamily: 'Nunito'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: { color: '#1E293B' }
      },
      splitLine: {
        lineStyle: { type: 'dashed', color: '#E2E8F0' }
      }
    },
    series: [
      {
        name: 'Usage',
        type: 'bar',
        barWidth: '60%',
        data: stats.trend.map((t: any) => t.count),
        itemStyle: {
          color: '#38BDF8',
          borderRadius: [4, 4, 0, 0],
          borderColor: '#1E293B',
          borderWidth: 2
        },
        emphasis: {
            itemStyle: {
                color: '#6EE7B7'
            }
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-fresh-bg font-sans p-6">
      {/* Header */}
      <header className="mb-8 flex justify-between items-center bg-white p-4 rounded-cartoon border-2 border-fresh-border shadow-cartoon">
        <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors border-2 border-transparent hover:border-fresh-border">
                <ArrowLeft size={24} className="text-fresh-text" />
            </Link>
            <div className="flex items-center gap-2">
                <div className="p-2 bg-fresh-secondary rounded-lg border-2 border-fresh-border shadow-cartoon-sm">
                    <LayoutDashboard size={24} className="text-black" />
                </div>
                <h1 className="text-2xl font-black text-fresh-text">Admin Dashboard</h1>
            </div>
        </div>
        <button onClick={fetchStats} className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-fresh-border rounded-xl font-bold hover:shadow-cartoon-sm transition-all active:translate-y-1">
            <RefreshCw size={18} />
            <span>Refresh</span>
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard 
            title="Total Users" 
            value={stats.stats.totalUsers} 
            icon={<Users size={24} className="text-white" />} 
            color="bg-primary" 
        />
        <StatCard 
            title="Total Usage" 
            value={stats.stats.totalUsage} 
            icon={<TrendingUp size={24} className="text-black" />} 
            color="bg-fresh-main" 
        />
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Section */}
        <div className="bg-white p-6 rounded-cartoon border-2 border-fresh-border shadow-cartoon">
            <h2 className="text-lg font-black text-fresh-text mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" />
                Usage Trend (7 Days)
            </h2>
            <div className="h-[300px] w-full">
                <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
            </div>
        </div>

        {/* User Table Section */}
        <div className="bg-white p-6 rounded-cartoon border-2 border-fresh-border shadow-cartoon flex flex-col h-[400px]">
            <h2 className="text-lg font-black text-fresh-text mb-4 flex items-center gap-2">
                <Users size={20} className="text-fresh-accent" />
                Top Users
            </h2>
            <div className="overflow-y-auto custom-scrollbar flex-1">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white z-10">
                        <tr>
                            <th className="p-3 border-b-2 border-fresh-border text-xs font-black text-gray-500 uppercase">User ID</th>
                            <th className="p-3 border-b-2 border-fresh-border text-xs font-black text-gray-500 uppercase text-right">Usage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.users.map((user: any) => (
                            <tr key={user.id} className="hover:bg-fresh-bg transition-colors group">
                                <td className="p-3 border-b border-gray-100 font-bold text-sm text-fresh-text">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 border border-fresh-border flex items-center justify-center text-xs font-black text-gray-500 group-hover:bg-white group-hover:shadow-cartoon-sm transition-all">
                                            {user.username[0].toUpperCase()}
                                        </div>
                                        {user.username}
                                    </div>
                                </td>
                                <td className="p-3 border-b border-gray-100 text-right font-mono font-bold text-primary">
                                    {user.usageCount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: any) => (
    <div className="bg-white p-6 rounded-cartoon border-2 border-fresh-border shadow-cartoon flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
        <div className={`w-16 h-16 rounded-2xl border-2 border-fresh-border shadow-cartoon-sm flex items-center justify-center ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{title}</p>
            <h3 className="text-3xl font-black text-fresh-text">{value}</h3>
        </div>
    </div>
);

export default AdminDashboard;
