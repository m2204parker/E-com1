export interface NavLink {
  label: string;
  href: string;
}

export interface MegaTile {
  label: string;
  href: string;
  image: string;
}

export interface MegaMenu {
  columns: NavLink[][];
  tiles: MegaTile[];
}

export interface NavItem {
  label: string;
  href: string;
  mega?: MegaMenu;
}

const files = 'https://www.powerlook.in/cdn/shop/files';

const tile = (label: string, href: string, image: string): MegaTile => ({
  label,
  href,
  image: `${files}/${image}`,
});

export const NAV_ITEMS: NavItem[] = [
  { label: 'Trending 2026', href: '/collections/trending-now' },
  {
    label: 'New Arrivals',
    href: '/collections/new-arrivals-view-all',
    mega: {
      columns: [
        [
          { label: 'Shirts', href: '/collections/new-arrivals-shirts' },
          { label: 'T-Shirts', href: '/collections/new-arrivals-t-shirts' },
          { label: 'Bottoms', href: '/collections/new-arrivals-bottoms' },
          { label: 'View All', href: '/collections/new-arrivals-view-all' },
        ],
      ],
      tiles: [],
    },
  },
  {
    label: 'T-Shirts',
    href: '/collections/t-shirt-view-all',
    mega: {
      columns: [
        [
          { label: 'Plain T-Shirts', href: '/collections/t-shirts-plain-t-shirts' },
          { label: 'Printed T-Shirts', href: '/collections/t-shirts-printed-t-shirts' },
          { label: 'Polos', href: '/collections/t-shirts-textured-polos' },
          { label: 'Striped T-Shirts', href: '/collections/t-shirts-striped-t-shirts' },
          { label: 'Oversized T-Shirts', href: '/collections/t-shirts-oversized-t-shirts' },
          { label: 'Vests', href: '/collections/vests' },
          { label: 'View All', href: '/collections/t-shirt-view-all' },
        ],
      ],
      tiles: [
        tile('Plain T-Shirts', '/collections/t-shirts-plain-t-shirts', 'dp11224111.jpg?v=1755939292'),
        tile('Printed T-Shirts', '/collections/t-shirts-printed-t-shirts', '5_2327e1ae-8bc5-4bd4-8933-658684433c80.jpg?v=1764671986'),
        tile('Polos', '/collections/t-shirts-textured-polos', '4_7bfc4bdc-7b4a-4a49-ba27-3d711264e51c.jpg?v=1781246828'),
        tile('Striped T-Shirts', '/collections/t-shirts-striped-t-shirts', '1427111_1.jpg?v=1758717123'),
        tile('Oversized T-Shirts', '/collections/t-shirts-oversized-t-shirts', '3_4910b72e-fb60-4e6d-b8c2-1a7798fa2773.jpg?v=1760683681'),
        tile('Vests', '/collections/vests', '2_57.jpg?v=1778476460'),
      ],
    },
  },
  {
    label: 'Shirts',
    href: '/collections/shirts-view-all',
    mega: {
      columns: [
        [
          { label: 'Plain Shirts', href: '/collections/shirts-plain-shirts' },
          { label: 'Checked Shirts', href: '/collections/shirts-checked-shirts' },
          { label: 'Printed Shirts', href: '/collections/shirts-printed-shirts' },
          { label: 'Striped Shirts', href: '/collections/shirts-striped-shirts' },
          { label: 'Oversized Shirts', href: '/collections/shirts-oversized-shirts-1' },
          { label: 'Denim Shirts', href: '/collections/denim-shirt' },
          { label: 'View All', href: '/collections/shirts-view-all' },
        ],
      ],
      tiles: [
        tile('Plain Shirts', '/collections/shirts-plain-shirts', 'dp11251921.jpg?v=1755939376'),
        tile('Checked Shirts', '/collections/shirts-checked-shirts', '3_ff567c3e-97bd-4ab2-89af-65531244dc42.jpg?v=1761806011'),
        tile('Printed Shirts', '/collections/shirts-printed-shirts', '1_6dcca299-e9b3-4951-ba40-a5c9176822fb.jpg?v=1766052176'),
        tile('Striped Shirts', '/collections/shirts-striped-shirts', '1351321_4.jpg?v=1755938455'),
        tile('Oversized Shirts', '/collections/shirts-oversized-shirts-1', '4_b4bd8f32-5b38-4597-a0c2-ff13d2789478.jpg?v=1773406921'),
        tile('Denim Shirts', '/collections/denim-shirt', '2_d7a226b7-1685-4e76-834d-5f30e5324ca9.jpg?v=1782993850'),
      ],
    },
  },
  {
    label: 'Bottoms',
    href: '/collections/bottoms-view-all',
    mega: {
      columns: [
        [
          { label: 'Trousers', href: '/collections/trousers' },
          { label: 'Jeans and Cargo', href: '/collections/bottoms-jeans-cargo' },
          { label: 'Track Pants', href: '/collections/bottoms-track-pants' },
          { label: 'Shorts', href: '/collections/bottoms-shorts' },
          { label: 'Baggy Bottoms', href: '/collections/baggy-jeans' },
          { label: 'View All', href: '/collections/bottoms-view-all' },
        ],
      ],
      tiles: [
        tile('Trousers', '/collections/trousers', 'dp11276560.jpg?v=1755939243'),
        tile('Jeans and Cargo', '/collections/bottoms-jeans-cargo', 'dp_1456.jpg?v=1755942324'),
        tile('Track Pants', '/collections/bottoms-track-pants', 'dp11194940-1.jpg?v=1755940033'),
        tile('Baggy Bottoms', '/collections/baggy-jeans', '3_4fcb71a1-8fe3-4e06-a55a-ffd72823abd6.jpg?v=1778499874'),
        tile('Shorts', '/collections/bottoms-shorts', '1354851_4.jpg?v=1755938246'),
      ],
    },
  },
  { label: 'Jackets', href: '/collections/jackets-view-all' },
  { label: 'Bags', href: '/collections/bags' },
  { label: 'Belts', href: '/collections/belts' },
];
