import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../../contexts';
import { translate } from '../statistique_translator';

const CustomTooltip = ({ active, payload, label, language, expenseYearName, revenueYearName }) => {
  
  const locale = language === 'Anglais' ? 'en-US' : 'fr-FR';
  
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="label text-gray-900 dark:text-gray-100 font-bold">{`${label}`}</p>
        <p className="intro text-blue-500">{`${translate('expenses', language)} (${expenseYearName}): ${new Intl.NumberFormat(locale, { style: 'currency', currency: 'XOF' }).format(payload[0].value)}`}</p>
        <p className="intro text-green-500">{`${translate('revenue', language)} (${revenueYearName}): ${new Intl.NumberFormat(locale, { style: 'currency', currency: 'XOF' }).format(payload[1].value)}`}</p>
      </div>
    );
  }
  return null;
};

const ComparisonChart = ({ expenseYear, revenueYear, theme }) => {
  const { language } = useLanguage();

  const locale = language === 'Anglais' ? 'en-US' : 'fr-FR';

  const data = [
    {
      name: translate('comparison', language),
      [translate('expenses', language)]: expenseYear?.total || 0,
      [translate('revenue', language)]: revenueYear?.totalRevenue || 0,
    },
  ];

  return (
    <div className={`p-4 rounded-xl shadow-lg ${theme === "light" ? "bg-gray-700 text-white" : ""} border-2 h-96`}>
       <h3 className={`text-xl font-semibold mb-4`}>
        {translate('expenses_vs_revenue_comparison', language)}
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
          <XAxis dataKey="name" tick={{ fill: theme.text_color }} />
          <YAxis tickFormatter={(value) => new Intl.NumberFormat(locale, { notation: 'compact', compactDisplay: 'short' }).format(value)} tick={{ fill: theme.text_color }} />
          <Tooltip 
            content={<CustomTooltip 
                        language={language} 
                        expenseYearName={expenseYear.title}
                        revenueYearName={`${translate('year', language)} ${revenueYear.startDate.substring(0, 4)}-${revenueYear.endDate.substring(0, 4)}`}
                     />}
            cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
          />
          <Legend wrapperStyle={{ color: theme.text_color }} />
          <Bar dataKey={translate('expenses', language)} fill="#ef4444" name={`${translate('expenses', language)} (${expenseYear.title})`} />
          <Bar dataKey={translate('revenue', language)} fill="#22c55e" name={`${translate('revenue', language)} (${translate('year', language)} ${revenueYear.startDate.substring(0, 4)}-${revenueYear.endDate.substring(0, 4)})`} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;
