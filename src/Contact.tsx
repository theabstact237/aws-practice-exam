import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Linkedin, 
  Youtube, 
  Instagram, 
  Facebook, 
  Mail, 
  Phone, 
  MessageSquare, 
  Coffee, 
  DollarSign, 
  CreditCard, 
  Copy, 
  CheckCircle2
} from 'lucide-react';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Payment information (replace with actual accounts when available)
  const paymentInfo = {
    cashApp: "$KarlSiaka",
    zelle: "karlsiaka@example.com",
    paypal: "karlsiaka@example.com",
    venmo: "@KarlSiaka"
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');

    try {
      // Using Formspree as a static form backend
      // Replace 'YOUR_FORMSPREE_ENDPOINT' with your actual Formspree form ID
      const response = await fetch('https://formspree.io/f/YOUR_FORMSPREE_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
        }),
      });

      if (response.ok) {
        setFormStatus('success');
        // Clear form
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setFormStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(type);
      setTimeout(() => setCopiedText(null), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-sky-400 text-center mb-8 mt-8">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="bg-slate-800 border-slate-700 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-sky-400">Send a Message</CardTitle>
              <CardDescription className="text-slate-400">
                Have questions or feedback about the AWS practice exam? Let us know!
              </CardDescription>
            </CardHeader>
            <CardContent>
              {formStatus === 'success' ? (
                <Alert className="bg-green-900/50 border-green-700">
                  <AlertTitle className="text-green-300">Message Sent!</AlertTitle>
                  <AlertDescription className="text-slate-300">
                    Thank you for your message. We'll get back to you as soon as possible.
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-slate-200"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-slate-200"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-300">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-slate-200"
                      placeholder="Your phone number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-slate-300">Message</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-slate-200 min-h-[120px]"
                      placeholder="Your message or inquiry"
                      required
                    />
                  </div>
                  
                  {formStatus === 'error' && (
                    <Alert variant="destructive" className="bg-red-900/50 border-red-700">
                      <AlertTitle className="text-red-300">Error</AlertTitle>
                      <AlertDescription className="text-slate-300">
                        {errorMessage || 'There was an error sending your message. Please try again.'}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    disabled={formStatus === 'submitting'}
                  >
                    {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
          
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-sky-400">Connect With Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-sky-400" />
                  <span className="text-slate-300">contact@example.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-sky-400" />
                  <span className="text-slate-300">(123) 456-7890</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-sky-400" />
                  <span className="text-slate-300">Usually responds within 24 hours</span>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-lg font-medium text-slate-200 mb-3">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#linkedin-placeholder" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-400">
                      <Linkedin size={24} />
                    </a>
                    <a href="#youtube-placeholder" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-400">
                      <Youtube size={24} />
                    </a>
                    <a href="#instagram-placeholder" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-400">
                      <Instagram size={24} />
                    </a>
                    <a href="#facebook-placeholder" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-400">
                      <Facebook size={24} />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Support/Donation Card - Enhanced with multiple payment options */}
            <Card className="bg-slate-800 border-slate-700 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-sky-400">Support My Work</CardTitle>
                <CardDescription className="text-slate-400">
                  If you found this AWS practice exam helpful, consider supporting my work.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4">
                  Your support helps me create more free resources for the AWS certification community.
                </p>
                
                <Tabs defaultValue="cashapp" className="w-full">
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="cashapp" className="text-xs sm:text-sm">Cash App</TabsTrigger>
                    <TabsTrigger value="zelle" className="text-xs sm:text-sm">Zelle</TabsTrigger>
                    <TabsTrigger value="paypal" className="text-xs sm:text-sm">PayPal</TabsTrigger>
                    <TabsTrigger value="venmo" className="text-xs sm:text-sm">Venmo</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="cashapp" className="space-y-4">
                    <div className="bg-[#00D632] p-4 rounded-lg text-center">
                      <DollarSign className="h-8 w-8 mx-auto mb-2 text-white" />
                      <p className="font-bold text-white">{paymentInfo.cashApp}</p>
                    </div>
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        className="border-[#00D632] text-[#00D632] hover:bg-[#00D632]/10"
                        onClick={() => copyToClipboard(paymentInfo.cashApp, 'cashApp')}
                      >
                        {copiedText === 'cashApp' ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                        {copiedText === 'cashApp' ? 'Copied!' : 'Copy ID'}
                      </Button>
                      <a 
                        href={`https://cash.app/${paymentInfo.cashApp.substring(1)}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button className="bg-[#00D632] hover:bg-[#00C02D] text-white">
                          Open Cash App
                        </Button>
                      </a>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="zelle" className="space-y-4">
                    <div className="bg-[#6D1ED4] p-4 rounded-lg text-center">
                      <CreditCard className="h-8 w-8 mx-auto mb-2 text-white" />
                      <p className="font-bold text-white">{paymentInfo.zelle}</p>
                    </div>
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        className="border-[#6D1ED4] text-[#6D1ED4] hover:bg-[#6D1ED4]/10"
                        onClick={() => copyToClipboard(paymentInfo.zelle, 'zelle')}
                      >
                        {copiedText === 'zelle' ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                        {copiedText === 'zelle' ? 'Copied!' : 'Copy Email'}
                      </Button>
                      <Button className="bg-[#6D1ED4] hover:bg-[#5D19B4] text-white">
                        Open Zelle App
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="paypal" className="space-y-4">
                    <div className="bg-[#0070BA] p-4 rounded-lg text-center">
                      <DollarSign className="h-8 w-8 mx-auto mb-2 text-white" />
                      <p className="font-bold text-white">{paymentInfo.paypal}</p>
                    </div>
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        className="border-[#0070BA] text-[#0070BA] hover:bg-[#0070BA]/10"
                        onClick={() => copyToClipboard(paymentInfo.paypal, 'paypal')}
                      >
                        {copiedText === 'paypal' ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                        {copiedText === 'paypal' ? 'Copied!' : 'Copy Email'}
                      </Button>
                      <a 
                        href={`https://www.paypal.com/paypalme/KarlSiaka`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button className="bg-[#0070BA] hover:bg-[#005EA6] text-white">
                          PayPal.me
                        </Button>
                      </a>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="venmo" className="space-y-4">
                    <div className="bg-[#3D95CE] p-4 rounded-lg text-center">
                      <DollarSign className="h-8 w-8 mx-auto mb-2 text-white" />
                      <p className="font-bold text-white">{paymentInfo.venmo}</p>
                    </div>
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        className="border-[#3D95CE] text-[#3D95CE] hover:bg-[#3D95CE]/10"
                        onClick={() => copyToClipboard(paymentInfo.venmo, 'venmo')}
                      >
                        {copiedText === 'venmo' ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                        {copiedText === 'venmo' ? 'Copied!' : 'Copy ID'}
                      </Button>
                      <a 
                        href={`https://venmo.com/KarlSiaka`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button className="bg-[#3D95CE] hover:bg-[#3485BE] text-white">
                          Open Venmo
                        </Button>
                      </a>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <a 
                    href="https://www.buymeacoffee.com/karlsiaka" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block"
                  >
                    <Button className="w-full bg-[#FFDD00] hover:bg-[#EECF00] text-slate-900 font-bold flex items-center justify-center">
                      <Coffee className="mr-2 h-5 w-5" />
                      Buy Me a Coffee
                    </Button>
                  </a>
                  <p className="text-xs text-center text-slate-400 mt-2">
                    One-time or monthly support options available
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Button 
            onClick={() => window.location.href = '/'}
            variant="outline" 
            className="border-sky-600 text-sky-400 hover:bg-sky-900/20"
          >
            Back to Exam
          </Button>
        </div>
      </div>
      
      <footer className="mt-16 text-center text-slate-500 text-sm">
        <p>Built by Karl Siaka</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#linkedin-placeholder" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="hover:text-sky-400"><Linkedin size={20} /></a>
          <a href="#youtube-placeholder" target="_blank" rel="noopener noreferrer" aria-label="YouTube Channel" className="hover:text-sky-400"><Youtube size={20} /></a>
          <a href="#instagram-placeholder" target="_blank" rel="noopener noreferrer" aria-label="Instagram Profile" className="hover:text-sky-400"><Instagram size={20} /></a>
          <a href="#facebook-placeholder" target="_blank" rel="noopener noreferrer" aria-label="Facebook Profile" className="hover:text-sky-400"><Facebook size={20} /></a>
        </div>
      </footer>
    </div>
  );
}

export default Contact;
