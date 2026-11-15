import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { defaultZones } from '@/lib/predefined-tasks';

export default function RoomsZones() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZones, setSelectedZones] = useState<Set<string>>(new Set());

  const filteredZones = defaultZones.filter(zone =>
    zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    zone.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const zonesByType = {
    indoor: filteredZones.filter(z => z.type === 'indoor'),
    outdoor: filteredZones.filter(z => z.type === 'outdoor'),
  };

  const toggleZone = (zoneName: string) => {
    const newSelected = new Set(selectedZones);
    if (newSelected.has(zoneName)) {
      newSelected.delete(zoneName);
    } else {
      newSelected.add(zoneName);
    }
    setSelectedZones(newSelected);
  };

  const getZoneIcon = (type: string) => {
    return type === 'indoor' ? 'fas fa-home' : 'fas fa-tree';
  };

  const getZoneColor = (type: string) => {
    return type === 'indoor' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-green-100 text-green-800';
  };

  const renderZoneList = (zones: typeof defaultZones) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {zones.map((zone) => (
        <div
          key={zone.name}
          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedZones.has(zone.name)
              ? 'border-primary-500 bg-primary-50'
              : 'border-slate-200 hover:border-slate-300'
          }`}
          onClick={() => toggleZone(zone.name)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                selectedZones.has(zone.name) ? 'bg-primary-600' : 'bg-slate-100'
              }`}>
                <i className={`${getZoneIcon(zone.type)} ${
                  selectedZones.has(zone.name) ? 'text-white' : 'text-slate-600'
                }`}></i>
              </div>
              <div>
                <h3 className="font-medium text-slate-900">{zone.name}</h3>
                <Badge className={getZoneColor(zone.type)}>
                  {zone.type}
                </Badge>
              </div>
            </div>
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
              selectedZones.has(zone.name)
                ? 'border-primary-600 bg-primary-600'
                : 'border-slate-300'
            }`}>
              {selectedZones.has(zone.name) && (
                <i className="fas fa-check text-white text-xs"></i>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <MobileNav />
        
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Rooms & Zones</h1>
              <p className="text-slate-600">
                Manage your household spaces and organize tasks by location
              </p>
            </div>

            {/* Search and Actions */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search rooms and zones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <i className="fas fa-plus mr-2"></i>
                  Add Custom Zone
                </Button>
                <Button className="bg-primary-600 hover:bg-primary-700">
                  Add Selected ({selectedZones.size})
                </Button>
              </div>
            </div>

            {/* Zone Categories */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Available Zones</h2>
                  <div className="text-sm text-slate-500">
                    {selectedZones.size} of {filteredZones.length} selected
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All ({filteredZones.length})</TabsTrigger>
                    <TabsTrigger value="indoor">
                      Indoor ({zonesByType.indoor.length})
                    </TabsTrigger>
                    <TabsTrigger value="outdoor">
                      Outdoor ({zonesByType.outdoor.length})
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="mt-6">
                    {renderZoneList(filteredZones)}
                  </TabsContent>
                  
                  <TabsContent value="indoor" className="mt-6">
                    {renderZoneList(zonesByType.indoor)}
                  </TabsContent>
                  
                  <TabsContent value="outdoor" className="mt-6">
                    {renderZoneList(zonesByType.outdoor)}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
