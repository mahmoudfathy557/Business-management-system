import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card, Title, SegmentedButtons, Button, DataTable } from 'react-native-paper';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import apiService from '../services/api';

const screenWidth = Dimensions.get('window').width;

const ReportsScreen: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [selectedPeriod, setSelectedPeriod] = useState('week');
    const [reportType, setReportType] = useState('sales');
    const [salesData, setSalesData] = useState<any>(null);
    const [expenseData, setExpenseData] = useState<any>(null);
    const [profitData, setProfitData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadReportData();
    }, [selectedPeriod, reportType]);

    const loadReportData = async () => {
        setIsLoading(true);
        try {
            const endDate = new Date().toISOString().split('T')[0];
            const startDate = new Date(Date.now() - getPeriodDays() * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

            const [salesResponse, expenseResponse, profitResponse] = await Promise.all([
                apiService.getSalesReport(startDate, endDate),
                apiService.getExpenseReport(startDate, endDate),
                apiService.getProfitReport(startDate, endDate)
            ]);

            setSalesData(salesResponse.data);
            setExpenseData(expenseResponse.data);
            setProfitData(profitResponse.data);
        } catch (error) {
            console.error('Error loading report data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getPeriodDays = () => {
        switch (selectedPeriod) {
            case 'day': return 1;
            case 'week': return 7;
            case 'month': return 30;
            case 'year': return 365;
            default: return 7;
        }
    };

    const getChartData = () => {
        // Mock data for demonstration - replace with actual API data
        const mockData = {
            sales: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    data: [1200, 1500, 1800, 1400, 2000, 1600, 1900],
                    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                    strokeWidth: 2
                }]
            },
            expenses: {
                labels: ['Fuel', 'Maintenance', 'Salary', 'Other'],
                datasets: [{
                    data: [500, 300, 2000, 200],
                    color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`,
                    strokeWidth: 2
                }]
            },
            profit: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    data: [800, 1200, 1000, 1500],
                    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                    strokeWidth: 2
                }]
            }
        };

        return mockData[reportType as keyof typeof mockData];
    };

    const chartConfig = {
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16
        },
        propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726'
        }
    };

    const renderChart = () => {
        const data = getChartData();

        if (reportType === 'sales' || reportType === 'profit') {
            return (
                <LineChart
                    data={data}
                    width={screenWidth - 32}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                />
            );
        } else if (reportType === 'expenses') {
            return (
                <PieChart
                    data={data.datasets[0].data.map((value, index) => ({
                        name: data.labels[index],
                        population: value,
                        color: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
                        legendFontColor: '#7F7F7F',
                        legendFontSize: 15,
                    }))}
                    width={screenWidth - 32}
                    height={220}
                    chartConfig={chartConfig}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    style={styles.chart}
                />
            );
        }
    };

    const renderDataTable = () => {
        const mockTableData = [
            { period: 'Monday', sales: 1200, expenses: 500, profit: 700 },
            { period: 'Tuesday', sales: 1500, expenses: 600, profit: 900 },
            { period: 'Wednesday', sales: 1800, expenses: 400, profit: 1400 },
            { period: 'Thursday', sales: 1400, expenses: 700, profit: 700 },
            { period: 'Friday', sales: 2000, expenses: 800, profit: 1200 },
        ];

        return (
            <Card style={styles.tableCard}>
                <Card.Content>
                    <Title>Detailed Report</Title>
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title>Period</DataTable.Title>
                            <DataTable.Title numeric>Sales</DataTable.Title>
                            <DataTable.Title numeric>Expenses</DataTable.Title>
                            <DataTable.Title numeric>Profit</DataTable.Title>
                        </DataTable.Header>

                        {mockTableData.map((row, index) => (
                            <DataTable.Row key={index}>
                                <DataTable.Cell>{row.period}</DataTable.Cell>
                                <DataTable.Cell numeric>${row.sales}</DataTable.Cell>
                                <DataTable.Cell numeric>${row.expenses}</DataTable.Cell>
                                <DataTable.Cell numeric style={{ color: row.profit >= 0 ? '#4caf50' : '#f44336' }}>
                                    ${row.profit}
                                </DataTable.Cell>
                            </DataTable.Row>
                        ))}
                    </DataTable>
                </Card.Content>
            </Card>
        );
    };

    return (
        <ScrollView style={styles.container}>
            {/* Period Selector */}
            <Card style={styles.periodCard}>
                <Card.Content>
                    <Title>Select Period</Title>
                    <SegmentedButtons
                        value={selectedPeriod}
                        onValueChange={setSelectedPeriod}
                        buttons={[
                            { value: 'day', label: 'Today' },
                            { value: 'week', label: 'Week' },
                            { value: 'month', label: 'Month' },
                            { value: 'year', label: 'Year' },
                        ]}
                        style={styles.segmentedButtons}
                    />
                </Card.Content>
            </Card>

            {/* Report Type Selector */}
            <Card style={styles.typeCard}>
                <Card.Content>
                    <Title>Report Type</Title>
                    <SegmentedButtons
                        value={reportType}
                        onValueChange={setReportType}
                        buttons={[
                            { value: 'sales', label: 'Sales' },
                            { value: 'expenses', label: 'Expenses' },
                            { value: 'profit', label: 'Profit' },
                        ]}
                        style={styles.segmentedButtons}
                    />
                </Card.Content>
            </Card>

            {/* Chart */}
            <Card style={styles.chartCard}>
                <Card.Content>
                    <Title>{reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</Title>
                    {renderChart()}
                </Card.Content>
            </Card>

            {/* Data Table */}
            {renderDataTable()}

            {/* Export Button */}
            <Card style={styles.exportCard}>
                <Card.Content>
                    <Button
                        mode="contained"
                        onPress={() => {
                            // Implement export functionality
                            console.log('Export report');
                        }}
                        style={styles.exportButton}
                    >
                        Export Report
                    </Button>
                </Card.Content>
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    periodCard: {
        margin: 16,
        elevation: 2,
    },
    typeCard: {
        marginHorizontal: 16,
        marginBottom: 16,
        elevation: 2,
    },
    segmentedButtons: {
        marginTop: 12,
    },
    chartCard: {
        marginHorizontal: 16,
        marginBottom: 16,
        elevation: 2,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    tableCard: {
        marginHorizontal: 16,
        marginBottom: 16,
        elevation: 2,
    },
    exportCard: {
        margin: 16,
        marginBottom: 100,
        elevation: 2,
    },
    exportButton: {
        marginTop: 8,
    },
});

export default ReportsScreen;
