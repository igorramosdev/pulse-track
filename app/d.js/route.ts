import { NextResponse } from 'next/server'

// This is the widget loader script that gets embedded on client sites
const loaderScript = `
(function() {
  'use strict';
  
  var PULSE_ENDPOINT = '${process.env.NEXT_PUBLIC_APP_URL || ''}';
  var HEARTBEAT_INTERVAL = 15000; // 15 seconds
  var POLL_INTERVAL = 5000; // 5 seconds
  
  // Get or create visitor ID
  function getVisitorId() {
    var vid = localStorage.getItem('_pulse_vid');
    if (!vid) {
      vid = 'v_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('_pulse_vid', vid);
    }
    return vid;
  }
  
  // Send data to collect endpoint
  function send(data) {
    var payload = JSON.stringify(data);
    
    if (navigator.sendBeacon) {
      navigator.sendBeacon(PULSE_ENDPOINT + '/api/collect', payload);
    } else {
      fetch(PULSE_ENDPOINT + '/api/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true
      }).catch(function() {});
    }
  }
  
  // Get online count
  function getOnlineCount(token, callback) {
    fetch(PULSE_ENDPOINT + '/api/online?token=' + encodeURIComponent(token))
      .then(function(res) { return res.json(); })
      .then(function(data) { callback(null, data.online || 0); })
      .catch(function(err) { callback(err, 0); });
  }
  
  // Widget styles
  var styles = {
    pill: function(color, size) {
      var isSmall = size === 'small';
      return 'display:inline-flex;align-items:center;gap:' + (isSmall ? '6px' : '8px') + 
        ';padding:' + (isSmall ? '4px 10px' : '6px 14px') + 
        ';background:' + (color || '#10b981') + 
        ';color:#fff;border-radius:9999px;font-family:system-ui,sans-serif;' +
        'font-size:' + (isSmall ? '12px' : '14px') + ';font-weight:500;' +
        'box-shadow:0 2px 8px rgba(0,0,0,0.15);';
    },
    badge: function(color) {
      return 'display:inline-flex;align-items:center;gap:4px;padding:2px 8px;' +
        'background:' + (color || '#1f2937') + ';color:#fff;border-radius:4px;' +
        'font-family:system-ui,sans-serif;font-size:11px;font-weight:500;';
    },
    card: function(color) {
      return 'display:flex;flex-direction:column;align-items:center;padding:16px 24px;' +
        'background:#fff;border:1px solid #e5e7eb;border-radius:12px;' +
        'font-family:system-ui,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.08);';
    },
    floating: function(color, position) {
      var pos = position || 'bottom-right';
      var posStyles = {
        'left-upper': 'top:20px;left:20px;',
        'left-middle': 'top:50%;left:20px;transform:translateY(-50%);',
        'left-lower': 'bottom:20px;left:20px;',
        'bottom-left': 'bottom:20px;left:20px;',
        'bottom-center': 'bottom:20px;left:50%;transform:translateX(-50%);',
        'bottom-right': 'bottom:20px;right:20px;',
        'right-upper': 'top:20px;right:20px;',
        'right-middle': 'top:50%;right:20px;transform:translateY(-50%);',
        'right-lower': 'bottom:20px;right:20px;'
      };
      return 'position:fixed;' + (posStyles[pos] || posStyles['bottom-right']) +
        'z-index:9999;display:flex;align-items:center;gap:8px;padding:8px 16px;' +
        'background:' + (color || '#1f2937') + ';color:#fff;border-radius:9999px;' +
        'font-family:system-ui,sans-serif;font-size:14px;font-weight:500;' +
        'box-shadow:0 4px 20px rgba(0,0,0,0.2);cursor:pointer;' +
        'transition:transform 0.2s,box-shadow 0.2s;';
    }
  };
  
  // Pulse animation CSS
  var pulseCSS = '@keyframes pulse-dot{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.2);opacity:0.8}}';
  var styleEl = document.createElement('style');
  styleEl.textContent = pulseCSS;
  document.head.appendChild(styleEl);
  
  // Create pulse dot
  function createPulseDot(color) {
    return '<span style="width:8px;height:8px;background:' + (color || '#fff') + 
      ';border-radius:50%;animation:pulse-dot 2s infinite;"></span>';
  }
  
  // Render widget
  function renderWidget(container, config, count) {
    var variant = config[0] || 'pill';
    var token = config[1];
    var color = config[3];
    var size = config[4] || 'small';
    var position = config[3]; // For floating
    
    var html = '';
    var style = '';
    
    switch(variant) {
      case 'pill':
        style = styles.pill(color, size);
        html = createPulseDot() + '<span>' + count + ' online</span>';
        break;
      case 'badge':
        style = styles.badge(color);
        html = createPulseDot() + '<span>' + count + '</span>';
        break;
      case 'card':
        style = styles.card(color);
        html = '<div style="font-size:32px;font-weight:700;color:' + (color || '#10b981') + ';">' + count + '</div>' +
          '<div style="font-size:12px;color:#6b7280;margin-top:4px;">visitors online</div>';
        break;
      case 'floating':
        style = styles.floating(color, position);
        html = createPulseDot() + '<span>' + count + ' online</span>';
        break;
      default:
        style = styles.pill(color, size);
        html = createPulseDot() + '<span>' + count + ' online</span>';
    }
    
    container.setAttribute('style', style);
    container.innerHTML = html;
  }
  
  // Process queue
  function processQueue() {
    var queue = window._pulsetrack || [];
    
    queue.forEach(function(config) {
      if (!config || !config[1]) return;
      
      var variant = config[0];
      var token = config[1];
      var containerId = config[2] || '_pulse_' + token;
      
      var visitorId = getVisitorId();
      var path = window.location.pathname;
      var referrer = document.referrer || '';
      
      // Send initial pageview
      send({
        token: token,
        visitorId: visitorId,
        type: 'pageview',
        path: path,
        referrer: referrer
      });
      
      // Find or create container
      var container = document.getElementById(containerId);
      if (!container) {
        // Find the script tag and insert widget after it
        var scripts = document.querySelectorAll('script[src*="d.js"]');
        var lastScript = scripts[scripts.length - 1];
        if (lastScript) {
          container = document.createElement('div');
          container.id = containerId;
          lastScript.parentNode.insertBefore(container, lastScript.nextSibling);
        }
      }
      
      if (!container) return;
      
      // Initial render with loading state
      renderWidget(container, config, '...');
      
      // Get initial count
      getOnlineCount(token, function(err, count) {
        renderWidget(container, config, count);
      });
      
      // Start polling for count updates
      setInterval(function() {
        getOnlineCount(token, function(err, count) {
          renderWidget(container, config, count);
        });
      }, POLL_INTERVAL);
      
      // Start heartbeat
      setInterval(function() {
        send({
          token: token,
          visitorId: visitorId,
          type: 'heartbeat',
          path: window.location.pathname
        });
      }, HEARTBEAT_INTERVAL);
    });
  }
  
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', processQueue);
  } else {
    processQueue();
  }
})();
`

export async function GET() {
  // Replace placeholder with actual URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''
  const script = loaderScript.replace(
    "var PULSE_ENDPOINT = '';",
    `var PULSE_ENDPOINT = '${appUrl}';`
  )

  return new NextResponse(script, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
