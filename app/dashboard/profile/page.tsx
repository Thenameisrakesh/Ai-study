'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { User, Mail, Calendar, CheckCircle2 } from 'lucide-react'

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [updating, setUpdating] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user?.name) setName(user.name)
  }, [user])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    setMessage('')

    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      if (res.ok) {
        await refreshUser()
        setMessage('Profile updated successfully!')
      } else {
        setMessage('Failed to update profile.')
      }
    } catch (error) {
      setMessage('Something went wrong.')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-slate-400">Manage your account information and preferences.</p>
      </div>

      <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600/10 to-transparent border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-black">
              {user?.email[0].toUpperCase()}
            </div>
            <div>
              <CardTitle>{user?.name || 'Academic Explorer'}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8 space-y-6">
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                Display Name
              </label>
              <Input 
                placeholder="How should we call you?" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-950 border-slate-800 h-12 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-xs text-slate-500 uppercase flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  Email Address
                </div>
                <div className="text-sm font-medium text-slate-300">{user?.email}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-xs text-slate-500 uppercase flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  Joined On
                </div>
                <div className="text-sm font-medium text-slate-300">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
                </div>
              </div>
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${message.includes('success') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                <CheckCircle2 className="w-4 h-4" />
                {message}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 bg-blue-600 hover:bg-blue-500 font-bold"
              disabled={updating}
            >
              {updating ? 'Saving Changes...' : 'Save Profile Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card className="bg-slate-900 border-slate-800 border-dashed">
        <CardContent className="p-6 text-center space-y-2">
          <h3 className="font-semibold text-slate-200">More profile settings coming soon!</h3>
          <p className="text-sm text-slate-400">Soon you'll be able to change your password, avatar, and notification preferences.</p>
        </CardContent>
      </Card>
    </div>
  )
}
