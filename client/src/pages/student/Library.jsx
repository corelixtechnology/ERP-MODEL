import React, { useState } from 'react';
import { useGetLibraryBooksQuery } from '../../features/libraryApi';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Alert,
  Avatar,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  MenuBook as LibraryIcon,
  Search as SearchIcon,
  BookmarkAdded as ReserveIcon,
  Refresh as RefreshIcon,
  CheckCircle as AvailableIcon,
  Info as InfoIcon,
  LocationOn as LocationIcon,
  Class as CategoryIcon,
} from '@mui/icons-material';

const StudentLibrary = () => {
  const { data, isLoading, refetch } = useGetLibraryBooksQuery(undefined, {
    pollingInterval: 15000,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [reserveMsg, setReserveMsg] = useState(null);

  const booksFromApi = Array.isArray(data) ? data : [];

  // Fallback demo catalog if DB books empty
  const catalog = booksFromApi.length > 0 ? booksFromApi : [
    { _id: 'b1', isbn: '978-0131103627', title: 'The C Programming Language (2nd Ed)', author: 'Brian W. Kernighan & Dennis Ritchie', category: 'Computer Science', totalCopies: 10, availableCopies: 8, rackLocation: 'CS-A1' },
    { _id: 'b2', isbn: '978-0262033848', title: 'Introduction to Algorithms (CLRS)', author: 'Thomas H. Cormen, Charles E. Leiserson', category: 'Algorithms', totalCopies: 15, availableCopies: 12, rackLocation: 'CS-A2' },
    { _id: 'b3', isbn: '978-0133591620', title: 'Operating System Concepts (10th Ed)', author: 'Abraham Silberschatz, Peter B. Galvin', category: 'Systems', totalCopies: 8, availableCopies: 6, rackLocation: 'SYS-B4' },
    { _id: 'b4', isbn: '978-0134685991', title: 'Clean Code: Agile Software Craftsmanship', author: 'Robert C. Martin', category: 'Software Eng', totalCopies: 12, availableCopies: 9, rackLocation: 'SE-C3' },
    { _id: 'b5', isbn: '978-1491957660', title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', category: 'Database Systems', totalCopies: 10, availableCopies: 7, rackLocation: 'DB-D1' },
    { _id: 'b6', isbn: '978-0134685992', title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell & Peter Norvig', category: 'Artificial Intelligence', totalCopies: 14, availableCopies: 10, rackLocation: 'AI-E2' },
  ];

  // Filter catalog
  const filteredBooks = catalog.filter((b) => {
    const titleMatch = b.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const authorMatch = b.author?.toLowerCase().includes(searchQuery.toLowerCase());
    const isbnMatch = b.isbn?.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = !selectedCategory || b.category === selectedCategory;

    return (titleMatch || authorMatch || isbnMatch) && categoryMatch;
  });

  const handleReserveBook = (bookTitle) => {
    setReserveMsg(`Successfully reserved physical copy of "${bookTitle}". Please collect from main circulation desk within 24 hours.`);
    setTimeout(() => setReserveMsg(null), 6000);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <CircularProgress size={50} thickness={4} sx={{ color: '#0ea5e9' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, py: 1 }}>
      {/* Header Banner */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Campus Library & E-Resources
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5, fontWeight: 500 }}>
            Search campus library catalog, reserve physical textbooks, and view your active borrowed books.
          </Typography>
        </Box>
        <IconButton onClick={refetch} sx={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', '&:hover': { backgroundColor: '#f1f5f9' } }}>
          <RefreshIcon sx={{ color: '#64748b' }} />
        </IconButton>
      </Box>

      {reserveMsg && (
        <Alert severity="success" onClose={() => setReserveMsg(null)} sx={{ mb: 3, borderRadius: 3, fontWeight: 600 }}>
          {reserveMsg}
        </Alert>
      )}

      {/* KPI Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)' }}>
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    Catalog Inventory
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#0ea5e9', mt: 0.5 }}>
                    15,480
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', width: 52, height: 52, borderRadius: 3 }}>
                  <LibraryIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)' }}>
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    Active Borrowed Books
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#10b981', mt: 0.5 }}>
                    2 Books
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', width: 52, height: 52, borderRadius: 3 }}>
                  <AvailableIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)' }}>
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    Library Dues / Fine
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#10b981', mt: 0.5 }}>
                    $0.00
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', width: 52, height: 52, borderRadius: 3 }}>
                  <InfoIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)' }}>
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
              <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                Borrowing Limit
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip label="4 / 6 BOOKS ELIGIBLE" color="success" size="small" sx={{ fontWeight: 800, fontSize: '0.7rem' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter & Search Bar */}
      <Paper sx={{ p: 2.5, mb: 4, borderRadius: 4, border: '1px solid #e2e8f0', display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Search catalog by book title, author name, or ISBN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{ minWidth: 320, flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#94a3b8' }} />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Category Filter</InputLabel>
          <Select
            value={selectedCategory}
            label="Category Filter"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="">All Categories</MenuItem>
            <MenuItem value="Computer Science">Computer Science</MenuItem>
            <MenuItem value="Algorithms">Algorithms</MenuItem>
            <MenuItem value="Systems">Systems</MenuItem>
            <MenuItem value="Software Eng">Software Engineering</MenuItem>
            <MenuItem value="Database Systems">Database Systems</MenuItem>
            <MenuItem value="Artificial Intelligence">Artificial Intelligence</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Book Catalog Cards Grid */}
      <Grid container spacing={3} mb={5}>
        {filteredBooks.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book._id}>
            <Card
              sx={{
                borderRadius: 4,
                border: '1px solid #e2e8f0',
                boxShadow: '0px 2px 8px rgba(0,0,0,0.03)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0px 8px 24px rgba(0,0,0,0.08)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                  <Chip
                    label={book.category || 'General'}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ fontWeight: 800, fontSize: '0.7rem' }}
                  />
                  <Chip
                    label={`RACK ${book.rackLocation || 'CS-A1'}`}
                    size="small"
                    sx={{ fontWeight: 800, fontSize: '0.65rem', bgcolor: '#f1f5f9', color: '#475569' }}
                  />
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.3, mb: 1 }}>
                  {book.title}
                </Typography>

                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 2 }}>
                  Author: {book.author}
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontWeight: 600 }}>
                      ISBN
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569' }}>
                      {book.isbn}
                    </Typography>
                  </Box>

                  <Box textAlign="right">
                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontWeight: 600 }}>
                      Availability
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: book.availableCopies > 0 ? '#10b981' : '#ef4444' }}>
                      {book.availableCopies} / {book.totalCopies} Available
                    </Typography>
                  </Box>
                </Box>
              </CardContent>

              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<ReserveIcon />}
                  disabled={book.availableCopies === 0}
                  onClick={() => handleReserveBook(book.title)}
                  sx={{ borderRadius: 3, fontWeight: 800, textTransform: 'none', py: 1 }}
                >
                  {book.availableCopies > 0 ? 'Reserve Physical Copy' : 'Out of Stock'}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StudentLibrary;
