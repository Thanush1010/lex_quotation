export const services = [
  {
    id: 'ip',
    name: 'All IP',
    icon: '⚖️',
    subservices: [
      { 
        name: 'Patent searching with written opinion (Optional)', 
        officialFee: 0, 
        professionalFee: null,
        miscFee: null,
        description: 'Optional service'
      },
      { 
        name: 'Patent searching with oral opinion, Provisional specification drafting, filing', 
        officialFee: 1600, 
        professionalFee: null,
        miscFee: null,
        description: 'Stage 1 service'
      },
      { 
        name: 'Complete specification drafting, filing and request for early publication', 
        officialFee: 6500, 
        professionalFee: null,
        miscFee: null,
        description: 'Inclusive of Govt fees'
      },
      { 
        name: 'Response to Examination', 
        officialFee: 0, 
        professionalFee: null,
        miscFee: 0,
        description: 'If objections are raised'
      },
      { 
        name: 'Attending hearing and filing written submission', 
        officialFee: 0, 
        professionalFee: null,
        miscFee: 0,
        description: 'If required'
      }
    ],
    note: 'Payment shall be made in stages. Hearing costs apply only if required. GST will be charged separately.'
  },
  {
    id: 'patent',
    name: 'Patent',
    icon: '📜',
    subservices: [
      { 
        name: 'Patent searching with written opinion (Optional)', 
        officialFee: 0, 
        professionalFee: null,
        miscFee: null,
        description: 'Optional service'
      },
      { 
        name: 'Provisional specification drafting and filing', 
        officialFee: 1600, 
        professionalFee: null,
        miscFee: null,
        description: 'Stage 1 service'
      },
      { 
        name: 'Complete specification and expedited examination', 
        officialFee: 6500, 
        professionalFee: null,
        miscFee: null,
        description: 'Inclusive of Govt fees'
      },
      { 
        name: 'Response to Examination Report', 
        officialFee: 0, 
        professionalFee: null,
        miscFee: 0,
        description: 'If objections are raised'
      },
      { 
        name: 'Hearing attendance and written submission', 
        officialFee: 0, 
        professionalFee: null,
        miscFee: 0,
        description: 'If required'
      }
    ],
    note: 'Payment shall be made in stages. Additional costs will be quoted separately. GST will be charged separately.'
  },
  {
    id: 'trademark',
    name: 'Trademark',
    icon: '™️',
    subservices: [
      { 
        name: 'Trademark Search (optional)', 
        officialFee: 0,
        professionalFee: null,
        miscFee: null,
        description: 'Trademark search with result'
      },
      { 
        name: 'Trademark filing', 
        officialFee: 4500,
        professionalFee: null,
        miscFee: null,
        description: 'Trademark filing at TMO (Startup/Individual)'
      },
      { 
        name: 'Response to objection', 
        officialFee: 800,
        professionalFee: null,
        miscFee: null,
        description: 'Filing response to objection'
      },
      { 
        name: 'Attending objection hearing', 
        officialFee: 800,
        professionalFee: null,
        miscFee: null
      },
      { 
        name: 'Filing written submission', 
        officialFee: 0,
        professionalFee: null,
        miscFee: null
      }
    ],
    note: 'Payment shall be made stage wise. Stamp duty, notary, and bank charges will be communicated separately.'
  },
  {
    id: 'design',
    name: 'Design',
    icon: '🎨',
    subservices: [
      { 
        name: 'Design search with written opinion (Optional)', 
        officialFee: 0, 
        professionalFee: null,
        miscFee: null,
        description: 'Optional service'
      },
      { 
        name: 'Design filing with early publication', 
        officialFee: 1000, 
        professionalFee: null,
        miscFee: null,
        description: 'Inclusive of Govt Fees'
      },
      { 
        name: 'Response to Examination Report', 
        officialFee: 0, 
        professionalFee: null,
        miscFee: null,
        description: 'If objections are raised'
      },
      { 
        name: 'Hearing attendance and submission', 
        officialFee: 0, 
        professionalFee: null,
        miscFee: null,
        description: 'If required'
      }
    ],
    note: 'Payment shall be made in stages. Hearing costs apply only if required. GST will be charged separately.'
  },
  {
    id: 'copyright',
    name: 'Copyright',
    icon: '©️',
    subservices: [
      { 
        name: 'Copyright filing', 
        officialFee: 500,
        professionalFee: null,
        miscFee: null,
        description: 'Copyright filing at CRO'
      },
      { 
        name: 'Response to objection', 
        officialFee: 0,
        professionalFee: null,
        miscFee: null,
        description: 'Filing response to objection'
      },
      { 
        name: 'Hearing attendance and submission', 
        officialFee: 0,
        professionalFee: null,
        miscFee: null,
        description: 'If required'
      }
    ],
    note: 'Payment shall be made stage wise. GST will be charged separately.'
  }
];