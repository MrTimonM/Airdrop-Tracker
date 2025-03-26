# Airdrop Hunter Dashboard

A client-side web application for tracking and managing cryptocurrency airdrops. Data is stored locally in your browser using localStorage.

## Features

- 🎯 Track multiple airdrops with detailed information
- 🔄 Sort and filter airdrops by priority
- 🎨 Multiple theme options
- 📱 Responsive design for mobile and desktop
- 💾 Local storage for data persistence
- 📤 Export/Import functionality for data backup
- 🔍 Search functionality

## Fields Tracked

- Project Name
- Funding Amount
- Priority Level (High/Medium/Low)
- Airdrop Type (L1/L2/DeFi/DAO/NFT)
- Check-in Frequency
- Invested Amount
- Guide Link
- Notes

## Deployment Guide

### Option 1: Fork & Deploy (Recommended)

1. Fork the repository from [MrTimonM/Airdrop-Tracker](https://github.com/MrTimonM/Airdrop-Tracker)
   - Click the "Fork" button in the top right
   - Wait for the fork to complete

2. Enable GitHub Pages in your forked repository:
   - Go to your fork's Settings
   - Navigate to "Pages" in the sidebar
   - Under "Source", select "main" branch
   - Click Save
   - Your site will be published at `https://yourusername.github.io/Airdrop-Tracker`

### Option 2: Local Development

1. Clone your fork:
```bash
git clone https://github.com/yourusername/Airdrop-Tracker.git
cd Airdrop-Tracker
```

2. Open `index.html` in your browser to use locally

## Data Storage

- All data is stored in your browser's localStorage
- Use the Export feature regularly to backup your data
- Import feature allows restoration of backed-up data
- Data persists until browser cache is cleared

## Browser Support

- Chrome (Recommended)
- Firefox
- Safari
- Edge
- Any modern browser with localStorage support

## Security Notes

- Data is stored unencrypted in localStorage
- Don't store sensitive information
- Regular backups are recommended
- Clear browser data will erase stored airdrops

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgments

- Font Awesome for icons
- Various color themes inspired by popular design systems
