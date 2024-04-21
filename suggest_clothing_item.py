def get_suggested_colors(season_name):
    suggested_colors = {
        "Clear Spring": ["#FFFFFF", "#9E9FA1", "#1E1951 ", "#3697C2", "#53A396", "#4D884E", "#65AF58", "#F277AD", "#EFB0C3","#7063A8", "#E9692C", "#FFD43A"],
        "Warm Spring": ["#E1C6B3", "#AD8E79", "#80624A", "#56381E", "#98C6A9", "#53A396", "#4D884E", "#C2C2E2", "#E3506A","#E9692C", "#F1A02D", "#FFD43A"],
        "Clear Winter": ["#FFFFFF", "#9E9FA1", "#98C6A9", "#345A5D", "#C1C2E1","#96B3DF", "#3697C2", "#1E1951", "#EFB0C3", "#773752","#5D447B", "#7063A8"],
        "Warm Autumn": ["#E1C6B3", "#AD8E79", "#80624A", "#56381E", "#67682F", "#4D884E", "#809254", "#FFD43A", "#F1A02D","#E9692C", "#750C1A", "#A61F25"],
        "Deep Autumn": ["#AD8E79", "#56381E", "#67682F", "#305C39", "#4D884E", "#345A5D", "#750C1A", "#A61F25", "#D8242D","#E9692C", "#B65329", "#F1A02D"],
        "Soft Autumn": ["#E1C6B3", "#AD8E79", "#80624A", "#975F60", "#B65329", "#F1A02D", "#FFD43A", "#53A396", "#355E8A","#345A5D", "#4D884E", "#809254"],
        "Cool Winter": ["#FFFFFF", "#E1C6B3", "#AD8E79", "#9E9FA1", "#98C6A9", "#65AF58", "#3697C2", "#C1C2E1", "#F277AD","#EFB0C3", "#F3B256", "#FBE29F"],
        "Soft Summer": ["#FFFFFF", "#9E9FA1", "#6D6E72", "#442753", "#5D447B", "#750C1A", "#773752", "#975F60", "#355E8A","#C1C2E1", "#98C6A9", "#FBE29F"],
        "Cool Summer": ["#9E9FA1", "#96B3DF", "#3697C2", "#355E8A", "#1E1951", "#345A5D", "#98C6A9", "#C1C2E1", "#773752","#442753", "#750C1A", "#A61F25"],
        "Light Summer": ["#FFFFFF", "#E1C6B3", "#AD8E79", "#9E9FA1", "#975F60", "#773752", "#EFB0C3", "#C1C2E1", "#96B3DF","#3697C2", "#355E8A", "#98C6A9"],
        "Light Spring": ["#FFFFFF", "#E1C6B3", "#AD8E79", "#9E9FA1", "#98C6A9", "#65AF58", "#3697C2", "#C1C2E1", "#F277AD","#EFB0C3", "#F3B256", "#FBE29F"],
        "Deep Winter": ["#FFFFFF", "#000000", "#6D6E72", "#9E9FA1", "#1E1951", "#345A5D", "#355E8A", "#3697C2", "#F277AD","#5D447B", "#750C1A", "#D8242D"],
    }
    
    return suggested_colors.get(season_name, [])
