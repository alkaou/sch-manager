import React from 'react';
import { useLanguage } from '../../contexts';
import { translate } from '../statistique_translator';
import { ArrowDown, ArrowUp, TrendingUp, TrendingDown, Minus } from 'lucide-react';

// Helper to format currency
const formatCurrency = (amount, language) => {
  // Fallback to 0 if amount is not a valid number
  const numericAmount = Number(amount);
  const locale = language === 'Anglais' ? 'en-US' : 'fr-FR';
  if (isNaN(numericAmount)) {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'XOF' }).format(0);
  }
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'XOF' }).format(numericAmount);
};

const StatCard = ({ title, value, icon, borderColor, theme, language }) => (
  <div className={`p-1 overflow-hidden border-2 rounded-xl shadow-lg flex items-center space-x-2 border-l-4 ${borderColor} ${theme === "light" ? "bg-white text-gray-700" : ""} transition-transform transform hover:scale-105`}>
    <div className={`rounded-full`}>
      {icon}
    </div>
    <div>
      <h4 className={`text-sm font-medium opacity-75`}>{title}</h4>
      <p className={`text-2xl font-bold`}>{formatCurrency(value, language)}</p>
    </div>
  </div>
);

const ComparisonSummary = ({ expenseYear, revenueYear, theme, text_color }) => {
  const { language } = useLanguage();

  const totalExpenses = expenseYear?.total || 0;
  const totalRevenue = revenueYear?.totalRevenue || 0;
  const profitOrLoss = totalRevenue - totalExpenses;

  const getProfitLossInfo = () => {
    if (profitOrLoss > 0) {
      return {
        label: translate('profit', language),
        color: 'text-green-500',
        borderColor: 'border-green-500',
        icon: <TrendingUp className="w-8 h-8 text-green-500" />,
      };
    } else if (profitOrLoss < 0) {
      return {
        label: translate('loss', language),
        color: 'text-red-500',
        borderColor: 'border-red-500',
        icon: <TrendingDown className="w-8 h-8 text-red-500" />,
      };
    }
    return {
      label: translate('breakeven', language),
      color: text_color,
      borderColor: `border-gray-500`,
      icon: <Minus className={`w-8 h-8 ${text_color}`} />,
    };
  };

  const profitInfo = getProfitLossInfo();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title={`${translate('total_expenses_for', language)} ${expenseYear.title}`}
        value={totalExpenses}
        icon={<ArrowDown className="w-8 h-8 text-red-500" />}
        borderColor="border-red-500"
        theme={theme}
        language={language}
      />
      <StatCard
        title={`${translate('total_revenue_for', language)} ${translate('year', language)} ${revenueYear.startDate.substring(0, 4)}-${revenueYear.endDate.substring(0, 4)}`}
        value={totalRevenue}
        icon={<ArrowUp className="w-8 h-8 text-green-500" />}
        borderColor="border-green-500"
        theme={theme}
        language={language}
      />
      <StatCard
        title={profitInfo.label}
        value={profitOrLoss}
        icon={profitInfo.icon}
        borderColor={profitInfo.borderColor}
        theme={theme}
        language={language}
      />
    </div>
  );
};

export default ComparisonSummary;
