import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import BarcodeScanner from './BarcodeScanner';
import { fetchBookByISBN } from '@/services/bookService';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { useToast } from './ui/use-toast';
import { BookOpen, Settings, Library, ScanBarcode, Plus, Star, Trash2, Edit } from 'lucide-react';

const GENRES = [
  'Fiction', 'Mystery', 'Romance', 'Science Fiction', 'Fantasy',
  'Thriller', 'Historical', 'Biography', 'Self-Help', 'Business'
];

export default function Profile() {
  const { user, updatePreferences, addToLibrary, removeFromLibrary, updateLibraryBook } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedGenres, setSelectedGenres] = useState<string[]>(user?.preferences?.genres || []);
  const [language, setLanguage] = useState(user?.preferences?.language || 'en');
  const [readingDuration, setReadingDuration] = useState(user?.preferences?.readingDuration || 'medium');
  const [showScanner, setShowScanner] = useState(false);
  const [manualISBN, setManualISBN] = useState('');
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editRating, setEditRating] = useState(0);

  if (!user) {
    navigate('/login');
    return null;
  }

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleSavePreferences = () => {
    if (selectedGenres.length === 0) {
      toast({
        title: 'Select at least one genre',
        variant: 'destructive'
      });
      return;
    }

    updatePreferences({
      genres: selectedGenres,
      language,
      readingDuration
    });

    toast({
      title: 'Preferences updated!',
      description: 'Your reading preferences have been saved.'
    });
  };

  const handleScanResult = async (isbn: string) => {
    setIsAddingBook(true);
    try {
      const bookData = await fetchBookByISBN(isbn);
      addToLibrary({
        ...bookData,
        addedAt: new Date().toISOString()
      });
      toast({
        title: '¡Libro agregado!',
        description: `${bookData.title} se agregó a tu biblioteca.`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo agregar el libro',
        variant: 'destructive'
      });
    } finally {
      setIsAddingBook(false);
    }
  };

  const handleManualAdd = async () => {
    if (!manualISBN.trim()) {
      toast({
        title: 'ISBN requerido',
        description: 'Por favor ingresa un código ISBN',
        variant: 'destructive'
      });
      return;
    }

    setIsAddingBook(true);
    try {
      const bookData = await fetchBookByISBN(manualISBN);
      addToLibrary({
        ...bookData,
        addedAt: new Date().toISOString()
      });
      toast({
        title: '¡Libro agregado!',
        description: `${bookData.title} se agregó a tu biblioteca.`
      });
      setManualISBN('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo agregar el libro',
        variant: 'destructive'
      });
    } finally {
      setIsAddingBook(false);
    }
  };

  const handleRemoveBook = (bookId: string) => {
    removeFromLibrary(bookId);
    toast({
      title: 'Libro eliminado',
      description: 'El libro se eliminó de tu biblioteca.'
    });
  };

  const handleEditBook = (book: any) => {
    setEditingBook(book);
    setEditNotes(book.notes || '');
    setEditRating(book.rating || 0);
  };

  const handleSaveEdit = () => {
    if (editingBook) {
      updateLibraryBook(editingBook.id, {
        notes: editNotes,
        rating: editRating
      });
      toast({
        title: 'Libro actualizado',
        description: 'Los cambios se guardaron correctamente.'
      });
      setEditingBook(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Your Profile</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>

          <Tabs defaultValue="library" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="library" className="flex items-center gap-2">
                <Library className="w-4 h-4" />
                Mi Biblioteca
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="library">
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-serif">Mi Biblioteca Personal</CardTitle>
                      <CardDescription>
                        Libros que has leído o estás leyendo
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => setShowScanner(true)} size="sm">
                        <ScanBarcode className="w-4 h-4 mr-2" />
                        Escanear
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ingresa ISBN manualmente"
                      value={manualISBN}
                      onChange={(e) => setManualISBN(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleManualAdd()}
                    />
                    <Button onClick={handleManualAdd} disabled={isAddingBook}>
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar
                    </Button>
                  </div>

                  {(!user.library || user.library.length === 0) ? (
                    <div className="text-center py-12">
                      <Library className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">Tu biblioteca está vacía</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Escanea o agrega libros manualmente para comenzar
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {user.library.map((book, index) => (
                        <div
                          key={`${book.id}-${index}`}
                          className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <img
                            src={book.cover}
                            alt={book.title}
                            className="w-20 h-28 object-cover rounded shadow"
                          />
                          <div className="flex-1">
                            <h3 className="font-serif font-bold text-gray-900 mb-1">
                              {book.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                            {book.rating && (
                              <div className="flex gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < book.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                            {book.notes && (
                              <p className="text-xs text-gray-600 italic mb-2">"{book.notes}"</p>
                            )}
                            <p className="text-xs text-gray-500">
                              ISBN: {book.isbn} • Agregado el {new Date(book.addedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditBook(book)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRemoveBook(book.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif">Reading Preferences</CardTitle>
                  <CardDescription>
                    Update your preferences to get better recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Favorite Genres</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {GENRES.map(genre => (
                        <div key={genre} className="flex items-center space-x-2">
                          <Checkbox
                            id={`pref-${genre}`}
                            checked={selectedGenres.includes(genre)}
                            onCheckedChange={() => toggleGenre(genre)}
                          />
                          <label
                            htmlFor={`pref-${genre}`}
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            {genre}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pref-language">Preferred Language</Label>
                    <select
                      id="pref-language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pref-duration">Reading Duration Preference</Label>
                    <select
                      id="pref-duration"
                      value={readingDuration}
                      onChange={(e) => setReadingDuration(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      <option value="short">Short (&lt; 200 pages)</option>
                      <option value="medium">Medium (200-400 pages)</option>
                      <option value="long">Long (&gt; 400 pages)</option>
                    </select>
                  </div>

                  <Button onClick={handleSavePreferences} className="w-full">
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif">Reading History</CardTitle>
                  <CardDescription>
                    Books you've discovered on THOTH
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(!user.history || user.history.length === 0) ? (
                    <div className="text-center py-12">
                      <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">No books revealed yet</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Start discovering books to build your history
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {user.history.map((book, index) => (
                        <div
                          key={`${book.id}-${index}-history`}
                          className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <img
                            src={book.cover}
                            alt={book.title}
                            className="w-16 h-24 object-cover rounded shadow"
                          />
                          <div className="flex-1">
                            <h3 className="font-serif font-bold text-gray-900 mb-1">
                              {book.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                            <p className="text-xs text-gray-500">
                              Revealed on {new Date(book.revealedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <BarcodeScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={handleScanResult}
      />

      <Dialog open={!!editingBook} onOpenChange={() => setEditingBook(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">Editar Libro</DialogTitle>
          </DialogHeader>
          {editingBook && (
            <div className="space-y-4">
              <div>
                <h3 className="font-serif font-bold text-lg mb-1">{editingBook.title}</h3>
                <p className="text-sm text-gray-600">by {editingBook.author}</p>
              </div>

              <div className="space-y-2">
                <Label>Calificación</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 cursor-pointer transition-colors ${
                          star <= editRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  placeholder="Tus pensamientos sobre este libro..."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveEdit} className="flex-1">
                  Guardar
                </Button>
                <Button variant="outline" onClick={() => setEditingBook(null)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}