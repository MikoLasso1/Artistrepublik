const defaultPricing = [
  {
    name: 'Basic',
    amount: 19.99,
    download_types: ['WAV'],
    music_recording: 1,
    distribute_amount: 0,
    online_streams: 10000,
    music_videos: 0,
    for_profit_performances: 0,
    radio_rights: 0,
    radio_station_amount: 0,
    exclusive: 0
  },
  {
    name: 'Premium',
    amount: 29.99,
    download_types: ['WAV', 'MP3'],
    music_recording: 1,
    distribute_amount: 10000,
    online_streams: 100000,
    music_videos: 1,
    for_profit_performances: 1,
    radio_rights: 0,
    radio_station_amount: 0,
    exclusive: 0,
    sales: []
  },
  {
    name: 'Premium + Stems',
    amount: 49.99,
    download_types: ['WAV', 'MP3', 'Track Stems'],
    music_recording: 1,
    distribute_amount: 10000,
    online_streams: 100000,
    music_videos: 1,
    for_profit_performances: 1,
    radio_rights: 0,
    radio_station_amount: 0,
    exclusive: 0,
    sales: []
  },
  {
    name: 'Unlimited',
    amount: 69.99,
    download_types: ['WAV', 'MP3', 'Track Stems'],
    music_recording: 1,
    distribute_amount: null,
    online_streams: null,
    music_videos: null,
    for_profit_performances: 1,
    radio_rights: 1,
    radio_station_amount: 0,
    exclusive: 0,
    sales: []
  },
  {
    name: 'Exclusive',
    amount: 100.00,
    download_types: ['WAV', 'MP3', 'Track Stems'],
    music_recording: 1,
    distribute_amount: null,
    online_streams: null,
    music_videos: null,
    for_profit_performances: 1,
    radio_rights: 1,
    radio_station_amount: 10,
    exclusive: 1,
    sales: []
  }
]

export { defaultPricing }
