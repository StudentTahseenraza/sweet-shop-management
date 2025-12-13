// Mock responses for endpoints that aren't implemented yet
export const mockInventoryEndpoints = (app: any) => {
  // Only mock if endpoints don't exist
  app.post('/api/inventory/restock', (req: any, res: any) => {
    res.status(200).json({ 
      success: true, 
      message: 'Mock: Inventory restocked' 
    });
  });

  app.get('/api/inventory/low-stock', (req: any, res: any) => {
    res.status(200).json({ 
      success: true, 
      data: [] 
    });
  });

  app.get('/api/inventory/history', (req: any, res: any) => {
    res.status(200).json({ 
      success: true, 
      data: [] 
    });
  });
};