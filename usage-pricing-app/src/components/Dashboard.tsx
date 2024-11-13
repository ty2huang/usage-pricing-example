import { Typography, Box, Select, MenuItem, TextField, Button } from '@mui/material';
import { apiHost, useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';

interface Parameter {
  widget_type: string;
  name: string;
  label: string;
  description: string;
  options?: Array<{ id: string; label: string }>;
  trigger_refresh?: boolean;
  selected_id?: string;
  min_date?: string | null;
  max_date?: string | null;
  selected_start_date?: string;
  selected_end_date?: string;
}

interface ParametersResponse {
  parameters: Parameter[];
}

interface MetricsData {
  time_period: string;
  fixed_cost: number;
  total_variable_costs: number;
  events_count: number;
  total_size_bytes: number;
  total_duration_ms: number;
}

const PANEL_WIDTH = 300;

const Dashboard: React.FC = () => {
  const { token2 } = useAuth();
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [groupBy, setGroupBy] = useState<string>('d');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [metricsData, setMetricsData] = useState<MetricsData[]>([]);

  useEffect(() => {
    const fetchParameters = async () => {
      try {
        const response = await fetch(`${apiHost}:4465/squirrels-v0/sample/v1/dataset/segmented-event-metrics/parameters`, {
          headers: {
            'Authorization': `Bearer ${token2}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch parameters');
        }

        const data: ParametersResponse = await response.json();
        setParameters(data.parameters);
        
        // Set initial values
        const dateParam = data.parameters.find(p => p.widget_type === 'date_range');
        if (dateParam) {
          setDateRange({
            startDate: dateParam.selected_start_date || '',
            endDate: dateParam.selected_end_date || ''
          });
        }

        const groupParam = data.parameters.find(p => p.widget_type === 'single_select');
        if (groupParam && groupParam.selected_id) {
          setGroupBy(groupParam.selected_id);
        }
      } catch (error) {
        console.error('Error fetching parameters:', error);
      }
    };

    fetchParameters();
  }, [token2]);

  const fetchMetricsData = async () => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('group_by', groupBy);
      queryParams.append('date_filter', dateRange.startDate);
      queryParams.append('date_filter', dateRange.endDate);

      const response = await fetch(
        `${apiHost}:4465/squirrels-v0/sample/v1/dataset/segmented-event-metrics?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${token2}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch metrics data');
      }

      const result = await response.json();
      setMetricsData(result.data);
    } catch (error) {
      console.error('Error fetching metrics data:', error);
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Dashboard Page
      </Typography>

      <Box sx={{ display: 'flex' }}>
        {/* Left Panel */}
        <Box sx={{ 
          width: PANEL_WIDTH, 
          borderRight: 1, 
          borderColor: 'divider',
          p: 2,
          height: '100vh',
          overflow: 'auto'
        }}>
          <Typography variant="h6" gutterBottom>
            <u>Parameters</u>
          </Typography>
          
          {parameters.map((param) => (
            <Box key={param.name} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                {param.label}
                <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
                  {param.description}
                </Typography>
              </Typography>

              {param.widget_type === 'single_select' && (
                <Select
                  fullWidth
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                  size="small"
                >
                  {param.options?.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              )}

              {param.widget_type === 'date_range' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Start Date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    size="small"
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  <TextField
                    fullWidth
                    type="date"
                    label="End Date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    size="small"
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                </Box>
              )}
            </Box>
          ))}

          <Button 
            fullWidth
            variant="contained" 
            onClick={fetchMetricsData}
            sx={{ mt: 2 }}
          >
            Update Chart
          </Button>
        </Box>

        {/* Right Content */}
        <Box sx={{ 
          flexGrow: 1, 
          p: 3,
          height: '100vh',
          overflow: 'auto'
        }}>
          {metricsData.length > 0 && (
            <>
              <BarChart
                width={800}
                height={400}
                data={metricsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time_period" />
                <YAxis label={{ value: 'Dollars ($)', angle: -90 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="fixed_cost" stackId="costs" fill="#8884d8" name="Fixed Cost" />
                <Bar dataKey="total_variable_costs" stackId="costs" fill="#82ca9d" name="Variable Cost">
                  <LabelList
                    dataKey={(entry) => '$' + ((entry as MetricsData).fixed_cost + (entry as MetricsData).total_variable_costs)}
                    position="top"
                  />
                </Bar>
              </BarChart>

              <BarChart
                width={800}
                height={400}
                data={metricsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time_period" />
                <YAxis label={{ value: 'Event Count', angle: -90 }} />
                <Tooltip />
                <Legend />
                <Bar type="monotone" dataKey="events_count" fill="#183b70" name="Events Count">
                  <LabelList dataKey="events_count" position="top" />
                </Bar>
              </BarChart>
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;