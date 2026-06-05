import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Button, Space, Tag, Tooltip } from 'antd';
import { ClockCircleOutlined, DeleteOutlined, PlusOutlined, CopyOutlined, BgColorsOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import '../styles/DigitalClock.css';

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONES = [
  { label: 'UTC (Coordinated Universal Time)', value: 'UTC' },
  { label: 'New York (EST/EDT)', value: 'America/New_York' },
  { label: 'Los Angeles (PST/PDT)', value: 'America/Los_Angeles' },
  { label: 'Chicago (CST/CDT)', value: 'America/Chicago' },
  { label: 'Denver (MST/MDT)', value: 'America/Denver' },
  { label: 'London (GMT/BST)', value: 'Europe/London' },
  { label: 'Paris (CET/CEST)', value: 'Europe/Paris' },
  { label: 'Berlin (CET/CEST)', value: 'Europe/Berlin' },
  { label: 'Dubai (GST)', value: 'Asia/Dubai' },
  { label: 'India (IST)', value: 'Asia/Kolkata' },
  { label: 'Bangkok (ICT)', value: 'Asia/Bangkok' },
  { label: 'Hong Kong (HKT)', value: 'Asia/Hong_Kong' },
  { label: 'Shanghai (CST)', value: 'Asia/Shanghai' },
  { label: 'Tokyo (JST)', value: 'Asia/Tokyo' },
  { label: 'Singapore (SGT)', value: 'Asia/Singapore' },
  { label: 'Sydney (AEDT/AEST)', value: 'Australia/Sydney' },
  { label: 'Melbourne (AEDT/AEST)', value: 'Australia/Melbourne' },
  { label: 'Auckland (NZDT/NZST)', value: 'Pacific/Auckland' },
  { label: 'Mexico City (CST/CDT)', value: 'America/Mexico_City' },
  { label: 'São Paulo (BRT/BRST)', value: 'America/Sao_Paulo' },
  { label: 'Toronto (EST/EDT)', value: 'America/Toronto' },
  { label: 'Vancouver (PST/PDT)', value: 'America/Vancouver' },
  { label: 'Moscow (MSK)', value: 'Europe/Moscow' },
  { label: 'Istanbul (EET/EEST)', value: 'Europe/Istanbul' },
  { label: 'Cairo (EET/EEST)', value: 'Africa/Cairo' },
  { label: 'Johannesburg (SAST)', value: 'Africa/Johannesburg' },
  { label: 'Lagos (WAT)', value: 'Africa/Lagos' },
];

const THEMES = [
  { name: 'Dark Green', bg: 'linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%)', text: '#00ff00' },
  { name: 'Cyberpunk', bg: 'linear-gradient(135deg, #0f0c29 0%, #302b63 100%)', text: '#00ffff' },
  { name: 'Ocean', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: '#00ff88' },
  { name: 'Sunset', bg: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)', text: '#ffe100' },
  { name: 'Forest', bg: 'linear-gradient(135deg, #0b3b0b 0%, #1a5a1a 100%)', text: '#00ff00' },
];

function DigitalClock() {
  const [selectedZones, setSelectedZones] = useState([
    'Asia/Shanghai',
    'America/New_York',
    'Europe/London'
  ]);
  const [times, setTimes] = useState({});
  const [selectValue, setSelectValue] = useState('');
  const [currentTheme, setCurrentTheme] = useState(0);
  const [is24Hour, setIs24Hour] = useState(true);

  // Update time every second
  useEffect(() => {
    const updateTimes = () => {
      const newTimes = {};
      selectedZones.forEach((zone) => {
        newTimes[zone] = dayjs().tz(zone);
      });
      setTimes(newTimes);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [selectedZones]);

  const addTimezone = () => {
    if (selectValue && !selectedZones.includes(selectValue)) {
      setSelectedZones([...selectedZones, selectValue]);
      setSelectValue('');
    }
  };

  const removeTimezone = (zone) => {
    if (selectedZones.length > 1) {
      setSelectedZones(selectedZones.filter((z) => z !== zone));
    }
  };

  const getTimezoneName = (zone) => {
    const tz = TIMEZONES.find((t) => t.value === zone);
    return tz ? tz.label : zone;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getAbbreviation = (zone) => {
    const time = times[zone];
    if (!time) return 'N/A';
    return time.format('z');
  };

  const theme = THEMES[currentTheme];

  return (
    <div className="digital-clock-wrapper">
      <div className="digital-clock-container" style={{ background: theme.bg }}>
        <h1 className="clock-title">
          <ClockCircleOutlined /> Digital Clock - Multiple Time Zones
        </h1>

        {/* Controls Section */}
        <Card className="controls-card" style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <div className="control-group">
                <label>Add Timezone:</label>
                <Select
                  placeholder="Select a timezone to add"
                  options={TIMEZONES.filter(
                    (tz) => !selectedZones.includes(tz.value)
                  )}
                  value={selectValue}
                  onChange={setSelectValue}
                  size="large"
                  style={{ width: '100%' }}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Button
                type="primary"
                size="large"
                onClick={addTimezone}
                icon={<PlusOutlined />}
                block
                style={{ height: '46px' }}
              >
                Add
              </Button>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="control-group">
                <label>Theme:</label>
                <Select
                  value={currentTheme}
                  onChange={setCurrentTheme}
                  options={THEMES.map((t, i) => ({ label: t.name, value: i }))}
                  size="large"
                  style={{ width: '100%' }}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button
                size="large"
                onClick={() => setIs24Hour(!is24Hour)}
                style={{ width: '100%', height: '46px' }}
              >
                {is24Hour ? '24H' : '12H'} Format
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Clock Cards Grid */}
        <Row gutter={[16, 16]}>
          {selectedZones.map((zone) => {
            const time = times[zone];
            if (!time) return null;

            const timeStr = is24Hour 
              ? time.format('HH:mm:ss')
              : time.format('hh:mm:ss A');
            const dateStr = time.format('YYYY-MM-DD');
            const dayStr = time.format('dddd');
            const offsetStr = time.format('Z');
            const abbrev = getAbbreviation(zone);

            return (
              <Col key={zone} xs={24} sm={12} md={8} lg={6}>
                <Card
                  className="clock-card"
                  hoverable
                  style={{ 
                    borderTop: `4px solid ${theme.text}`,
                    height: '100%'
                  }}
                  extra={
                    selectedZones.length > 1 && (
                      <Tooltip title="Remove timezone">
                        <DeleteOutlined
                          onClick={() => removeTimezone(zone)}
                          style={{
                            color: '#ff4d4f',
                            cursor: 'pointer',
                            fontSize: '18px'
                          }}
                        />
                      </Tooltip>
                    )
                  }
                >
                  <div className="clock-header">
                    <div style={{ color: theme.text }}>
                      {getTimezoneName(zone).split('(')[0].trim()}
                    </div>
                    <Tag color="cyan">{abbrev}</Tag>
                  </div>

                  <div className="digital-display" style={{ background: theme.bg }}>
                    <Tooltip title="Click to copy">
                      <span 
                        className="time-display"
                        style={{ color: theme.text }}
                        onClick={() => copyToClipboard(timeStr)}
                      >
                        {timeStr}
                      </span>
                    </Tooltip>
                  </div>

                  <div className="clock-details">
                    <div className="detail-item">
                      <span className="label">📅 Date:</span>
                      <span className="value">{dateStr}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">📆 Day:</span>
                      <span className="value">{dayStr}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">🌍 UTC:</span>
                      <span className="value">{offsetStr}</span>
                    </div>
                  </div>

                  <div className="clock-footer">
                    <Button 
                      type="text" 
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(timeStr)}
                      block
                    >
                      Copy Time
                    </Button>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>

        {/* Info Section */}
        <Card className="info-card" style={{ marginTop: 24 }}>
          <h3>💡 Tips:</h3>
          <ul>
            <li>Click on the time to copy it to clipboard</li>
            <li>Use the "Add" button to add more timezones</li>
            <li>Remove timezones by clicking the delete icon</li>
            <li>Switch between 24-hour and 12-hour formats</li>
            <li>Choose different themes for your preference</li>
            <li>Supports {TIMEZONES.length} major timezones worldwide</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

export default DigitalClock;