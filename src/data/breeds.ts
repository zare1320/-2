export interface BreedName {
  en: string;
  fa: string;
}

export interface BaseBreed {
  id: number;
  name: BreedName;
  category?: string;
  scientificName?: string;
  commonNames?: string[];
}

export interface DogBreed extends BaseBreed {
  group: string;
  size: string;
  temperament: string[];
  origin: string;
}

export interface CatBreed extends BaseBreed {
  origin: string;
  coat: string;
  temperament: string[];
}

export interface Bird extends BaseBreed {
    family: string;
}

export interface Amphibian extends BaseBreed {}
export interface Fish extends BaseBreed {}
export interface Mammal extends BaseBreed {}
export interface Reptile extends BaseBreed {}

export interface Horse extends BaseBreed {
    type?: string;
    origin?: string;
}

export interface Cow extends BaseBreed {
    purpose?: string;
}

export interface SmallRuminant extends BaseBreed {
    speciesType: 'Sheep' | 'Goat';
}

export const dogBreeds: DogBreed[] = [
  { id: 1, name: { en: "Labrador Retriever", fa: "لابرادور رتریور" }, group: 'Sporting', size: 'Large', temperament: ['Friendly', 'Outgoing', 'Gentle'], origin: 'Canada' },
  { id: 2, name: { en: "German Shepherd", fa: "جرمن شپرد" }, group: 'Herding', size: 'Large', temperament: ['Confident', 'Courageous', 'Smart'], origin: 'Germany' },
  { id: 3, name: { en: "Golden Retriever", fa: "گلدن رتریور" }, group: 'Sporting', size: 'Large', temperament: ['Intelligent', 'Friendly', 'Reliable'], origin: 'Scotland' },
  { id: 4, name: { en: "French Bulldog", fa: "فرنچ بولداگ" }, group: 'Non-Sporting', size: 'Small', temperament: ['Adaptable', 'Playful', 'Smart'], origin: 'France' },
  { id: 5, name: { en: "Beagle", fa: "بیگل" }, group: 'Hound', size: 'Small', temperament: ['Merry', 'Curious', 'Friendly'], origin: 'England' },
  { id: 6, name: { en: "Poodle", fa: "پودل" }, group: 'Non-Sporting', size: 'Medium', temperament: ['Proud', 'Active', 'Intelligent'], origin: 'Germany' },
  { id: 7, name: { en: "Siberian Husky", fa: "هاسکی سیبرین" }, group: 'Working', size: 'Medium', temperament: ['Outgoing', 'Mischievous', 'Loyal'], origin: 'Siberia' },
  { id: 8, name: { en: "Bernese Mountain Dog", fa: "برنیز مانتن داگ" }, group: 'Working', size: 'Giant', temperament: ['Good-natured', 'Calm', 'Strong'], origin: 'Switzerland' },
  { id: 9, name: { en: "Yorkshire Terrier", fa: "یورکشایر تریر" }, group: 'Toy', size: 'Toy', temperament: ['Feisty', 'Affectionate', 'Sprightly'], origin: 'England' },
  { id: 10, name: { en: "Dachshund", fa: "داشهوند" }, group: 'Hound', size: 'Small', temperament: ['Clever', 'Stubborn', 'Playful'], origin: 'Germany' },
  { id: 11, name: { en: "Boxer", fa: "باکسر" }, group: 'Working', size: 'Large', temperament: ['Bright', 'Fun-loving', 'Active'], origin: 'Germany' },
  { id: 12, name: { en: "Rottweiler", fa: "راتوایلر" }, group: 'Working', size: 'Large', temperament: ['Loyal', 'Loving', 'Confident'], origin: 'Germany' },
  { id: 13, name: { en: "Pug", fa: "پاگ" }, group: 'Toy', size: 'Small', temperament: ['Charming', 'Mischievous', 'Loving'], origin: 'China' },
  { id: 14, name: { en: "Chihuahua", fa: "چی‌واوا" }, group: 'Toy', size: 'Toy', temperament: ['Charming', 'Graceful', 'Sassy'], origin: 'Mexico' },
  { id: 15, name: { en: "Dalmatian", fa: "دالمیشن" }, group: 'Non-Sporting', size: 'Large', temperament: ['Dignified', 'Smart', 'Outgoing'], origin: 'Croatia' },
  { id: 16, name: { en: "Bulldog", fa: "بولداگ" }, group: 'Non-Sporting', size: 'Medium', temperament: ['Friendly', 'Courageous', 'Calm'], origin: 'England' },
  { id: 17, name: { en: "Great Dane", fa: "گریت دین" }, group: 'Working', size: 'Giant', temperament: ['Friendly', 'Patient', 'Dependable'], origin: 'Germany' },
  { id: 18, name: { en: "Doberman Pinscher", fa: "دوبرمن پینچر" }, group: 'Working', size: 'Large', temperament: ['Alert', 'Fearless', 'Loyal'], origin: 'Germany' },
  { id: 19, name: { en: "Australian Shepherd", fa: "استرالین شپرد" }, group: 'Herding', size: 'Medium', temperament: ['Smart', 'Work-oriented', 'Exuberant'], origin: 'USA' },
  { id: 20, name: { en: "Shih Tzu", fa: "شیتزو" }, group: 'Toy', size: 'Toy', temperament: ['Affectionate', 'Outgoing', 'Playful'], origin: 'Tibet' },
  { id: 21, name: { en: "Border Collie", fa: "بردر کولی" }, group: 'Herding', size: 'Medium', temperament: ['Energetic', 'Affectionate', 'Smart'], origin: 'Scotland' },
  { id: 22, name: { en: "Cocker Spaniel", fa: "کوکر اسپنیل" }, group: 'Sporting', size: 'Medium', temperament: ['Gentle', 'Smart', 'Happy'], origin: 'England' },
  { id: 23, name: { en: "Basset Hound", fa: "باست هاند" }, group: 'Hound', size: 'Medium', temperament: ['Charming', 'Patient', 'Low-key'], origin: 'France' },
  { id: 24, name: { en: "Cavalier King Charles Spaniel", fa: "کاوالیر کینگ چارلز اسپنیل" }, group: 'Toy', size: 'Small', temperament: ['Affectionate', 'Gentle', 'Graceful'], origin: 'United Kingdom' },
  { id: 25, name: { en: "Akita", fa: "آکیتا" }, group: 'Working', size: 'Large', temperament: ['Courageous', 'Dignified', 'Loyal'], origin: 'Japan' },
  { id: 26, name: { en: "Airedale Terrier", fa: "ایردیل تریر" }, group: 'Terrier', size: 'Large', temperament: ['Clever', 'Friendly', 'Courageous'], origin: 'England' },
  { id: 27, name: { en: "Boston Terrier", fa: "بوستون تریر" }, group: 'Non-Sporting', size: 'Small', temperament: ['Friendly', 'Bright', 'Amusing'], origin: 'USA' },
  { id: 28, name: { en: "Shetland Sheepdog", fa: "شتلند شیپداگ" }, group: 'Herding', size: 'Small', temperament: ['Playful', 'Energetic', 'Bright'], origin: 'Scotland' },
  { id: 29, name: { en: "Saint Bernard", fa: "سنت برنارد" }, group: 'Working', size: 'Giant', temperament: ['Playful', 'Charming', 'Inquisitive'], origin: 'Switzerland' },
  { id: 30, name: { en: "Newfoundland", fa: "نیوفاندلند" }, group: 'Working', size: 'Giant', temperament: ['Sweet', 'Patient', 'Devoted'], origin: 'Canada' },
];

export const catBreeds: CatBreed[] = [
  { id: 1, name: { en: "Abyssinian", fa: "حبشی" }, origin: "Ethiopia", coat: 'Shorthair', temperament: ['Active', 'Intelligent', 'Playful'] },
  { id: 2, name: { en: "Bengal", fa: "بنگال" }, origin: "USA", coat: 'Shorthair', temperament: ['Curious', 'Energetic', 'Agile'] },
  { id: 3, name: { en: "British Shorthair", fa: "بریتیش مو کوتاه" }, origin: "United Kingdom", coat: 'Shorthair', temperament: ['Easygoing', 'Affectionate', 'Calm'] },
  { id: 4, name: { en: "Maine Coon", fa: "مین کون" }, origin: "USA", coat: 'Longhair', temperament: ['Gentle', 'Friendly', 'Good-natured'] },
  { id: 5, name: { en: "Persian", fa: "پرشین" }, origin: "Iran (Persia)", coat: 'Longhair', temperament: ['Sweet', 'Quiet', 'Docile'] },
  { id: 6, name: { en: "Ragdoll", fa: "رگدال" }, origin: "USA", coat: 'Longhair', temperament: ['Placid', 'Loving', 'Gentle'] },
  { id: 7, name: { en: "Russian Blue", fa: "راشن بلو" }, origin: "Russia", coat: 'Shorthair', temperament: ['Reserved', 'Gentle', 'Intelligent'] },
  { id: 8, name: { en: "Siamese", fa: "سیامی" }, origin: "Thailand", coat: 'Shorthair', temperament: ['Vocal', 'Social', 'Affectionate'] },
  { id: 9, name: { en: "Sphynx", fa: "اسفینکس" }, origin: "Canada", coat: 'Hairless', temperament: ['Loyal', 'Curious', 'Mischievous'] },
  { id: 10, name: { en: "Siberian", fa: "سیبرین" }, origin: "Russia", coat: 'Longhair', temperament: ['Playful', 'Fearless', 'Affectionate'] },
  { id: 11, name: { en: "American Bobtail", fa: "بابتیل آمریکایی" }, origin: "USA", coat: 'Shorthair', temperament: ['Intelligent', 'Interactive', 'Playful'] },
  { id: 12, name: { en: "American Curl", fa: "کرل آمریکایی" }, origin: "USA", coat: 'Longhair', temperament: ['Curious', 'Affectionate', 'People-oriented'] },
  { id: 13, name: { en: "American Shorthair", fa: "آمریکن مو کوتاه" }, origin: "USA", coat: 'Shorthair', temperament: ['Even-tempered', 'Adaptable', 'Good hunter'] },
  { id: 14, name: { en: "Balinese", fa: "بالینیز" }, origin: "USA", coat: 'Longhair', temperament: ['Intelligent', 'Vocal', 'Social'] },
  { id: 15, name: { en: "Birman", fa: "بیرمن" }, origin: "Myanmar", coat: 'Longhair', temperament: ['Gentle', 'Quiet', 'Loving'] },
  { id: 16, name: { en: "Bombay", fa: "بمبئی" }, origin: "USA", coat: 'Shorthair', temperament: ['Affectionate', 'Playful', 'Curious'] },
  { id: 17, name: { en: "Burmese", fa: "برمه‌ای" }, origin: "Myanmar", coat: 'Shorthair', temperament: ['People-oriented', 'Playful', 'Charming'] },
  { id: 18, name: { en: "Chartreux", fa: "شارترو" }, origin: "France", coat: 'Shorthair', temperament: ['Quiet', 'Observant', 'Gentle'] },
  { id: 19, name: { en: "Cornish Rex", fa: "کورنیش رکس" }, origin: "United Kingdom", coat: 'Rex', temperament: ['Active', 'Affectionate', 'Curious'] },
  { id: 20, name: { en: "Devon Rex", fa: "دوون رکس" }, origin: "United Kingdom", coat: 'Rex', temperament: ['Mischievous', 'Playful', 'People-oriented'] },
  { id: 21, name: { en: "Egyptian Mau", fa: "مائو مصری" }, origin: "Egypt", coat: 'Shorthair', temperament: ['Loyal', 'Agile', 'Intelligent'] },
  { id: 22, name: { en: "Exotic Shorthair", fa: "اگزاتیک مو کوتاه" }, origin: "USA", coat: 'Shorthair', temperament: ['Sweet', 'Quiet', 'Playful'] },
  { id: 23, name: { en: "Havana Brown", fa: "هاوانا براون" }, origin: "United Kingdom", coat: 'Shorthair', temperament: ['Charming', 'Intelligent', 'Playful'] },
  { id: 24, name: { en: "Himalayan", fa: "هیمالیایی" }, origin: "USA/UK", coat: 'Longhair', temperament: ['Sweet', 'Docile', 'Quiet'] },
  { id: 25, name: { en: "Japanese Bobtail", fa: "بابتیل ژاپنی" }, origin: "Japan", coat: 'Shorthair', temperament: ['Playful', 'Smart', 'Active'] },
  { id: 26, name: { en: "Korat", fa: "کورات" }, origin: "Thailand", coat: 'Shorthair', temperament: ['Intelligent', 'Gentle', 'Good-natured'] },
  { id: 27, name: { en: "LaPerm", fa: "لاپرم" }, origin: "USA", coat: "Rex", temperament: ["Affectionate", "Curious", "Gentle"] },
  { id: 28, name: { en: "Manx", fa: "مانکس" }, origin: "Isle of Man", coat: 'Shorthair', temperament: ['Playful', 'Loyal', 'Good hunter'] },
  { id: 29, name: { en: "Norwegian Forest Cat", fa: "گربه جنگلی نروژی" }, origin: "Norway", coat: 'Longhair', temperament: ['Independent', 'Sturdy', 'Playful'] },
  { id: 30, name: { en: "Ocicat", fa: "اسی‌کت" }, origin: "USA", coat: 'Shorthair', temperament: ['Confident', 'Active', 'Social'] },
  { id: 31, name: { en: "Oriental", fa: "اورینتال" }, origin: "USA", coat: 'Shorthair', temperament: ['Entertaining', 'Curious', 'Affectionate'] },
  { id: 32, name: { en: "Scottish Fold", fa: "اسکاتیش فولد" }, origin: "Scotland", coat: 'Shorthair', temperament: ['Sweet-tempered', 'Undemanding', 'Playful'] },
  { id: 33, name: { en: "Selkirk Rex", fa: "سلکرک رکس" }, origin: "USA", coat: 'Rex', temperament: ['Patient', 'Tolerant', 'Playful'] },
  { id: 34, name: { en: "Singapura", fa: "سنگاپوری" }, origin: "Singapore", coat: 'Shorthair', temperament: ['Curious', 'Playful', 'Interactive'] },
  { id: 35, name: { en: "Somali", fa: "سومالی" }, origin: "USA", coat: 'Longhair', temperament: ['Active', 'Curious', 'Playful'] },
  { id: 36, name: { en: "Tonkinese", fa: "تونکینیز" }, origin: "Canada", coat: 'Shorthair', temperament: ['Social', 'Playful', 'Curious'] },
  { id: 37, name: { en: "Turkish Angora", fa: "آنقوره ترکی" }, origin: "Turkey", coat: 'Longhair', temperament: ['Graceful', 'Intelligent', 'Playful'] },
  { id: 38, name: { en: "Turkish Van", fa: "وان ترکی" }, origin: "Turkey", coat: 'Longhair', temperament: ['Energetic', 'Intelligent', 'Loves water'] },
];

export const birdBreeds: Bird[] = [
  { id: 1, name: { en: "African Grey Parrot", fa: "طوطی خاکستری آفریقایی" }, category: 'Parrot', family: 'Parrot', scientificName: "Psittacus erithacus" },
  { id: 2, name: { en: "Blue-and-gold Macaw", fa: "ماکائو آبی و طلایی" }, category: 'Parrot', family: 'Macaw', scientificName: "Ara ararauna" },
  { id: 3, name: { en: "Budgerigar", fa: "باجریگار (مرغ عشق)" }, category: 'Parrot', family: 'Parakeet', scientificName: "Melopsittacus undulatus" },
  { id: 4, name: { en: "Cockatiel", fa: "ککاتیل (عروس هلندی)" }, category: 'Parrot', family: 'Cockatoo', scientificName: "Nymphicus hollandicus" },
  { id: 5, name: { en: "Green-cheeked Conure", fa: "کانور گونه‌سبز" }, category: 'Parrot', family: 'Conure', scientificName: "Pyrrhura molinae" },
  { id: 6, name: { en: "Hyacinth Macaw", fa: "ماکائو سنبلی" }, category: 'Parrot', family: 'Macaw', scientificName: "Anodorhynchus hyacinthinus" },
  { id: 7, name: { en: "Lovebird", fa: "طوطی برزیلی" }, category: 'Parrot', family: 'Parrot', scientificName: "Agapornis" },
  { id: 8, name: { en: "Sulphur-crested Cockatoo", fa: "کاکادو کاکل‌گوگردی" }, category: 'Parrot', family: 'Cockatoo', scientificName: "Cacatua galerita" },
  { id: 9, name: { en: "Bald Eagle", fa: "عقاب سرسفید" }, category: 'Bird of Prey', family: 'Eagle', scientificName: "Haliaeetus leucocephalus" },
  { id: 10, name: { en: "Barn Owl", fa: "جغد انبار" }, category: 'Bird of Prey', family: 'Owl', scientificName: "Tyto alba" },
  { id: 11, name: { en: "Great Horned Owl", fa: "جغد شاخدار بزرگ" }, category: 'Bird of Prey', family: 'Owl', scientificName: "Bubo virginianus" },
  { id: 12, name: { en: "Peregrine Falcon", fa: "شاهین بحری" }, category: 'Bird of Prey', family: 'Falcon', scientificName: "Falco peregrinus" },
  { id: 13, name: { en: "Red-tailed Hawk", fa: "باز دم‌قرمز" }, category: 'Bird of Prey', family: 'Hawk', scientificName: "Buteo jamaicensis" },
  { id: 14, name: { en: "Canary", fa: "قناری" }, category: 'Songbird', family: 'Finch', scientificName: "Serinus canaria domestica" },
  { id: 15, name: { en: "Zebra Finch", fa: "فنچ گورخری" }, category: 'Songbird', family: 'Finch', scientificName: "Taeniopygia guttata" },
  { id: 16, name: { en: "Gouldian Finch", fa: "فنچ گولدین" }, category: 'Songbird', family: 'Finch', scientificName: "Erythrura gouldiae" },
  { id: 17, name: { en: "Diamond Dove", fa: "قمری الماسی" }, category: 'Dove & Pigeon', family: 'Dove', scientificName: "Geopelia cuneata" },
  { id: 18, name: { en: "Pigeon", fa: "کبوتر" }, category: 'Dove & Pigeon', family: 'Pigeon', scientificName: "Columba livia domestica" },
  { id: 19, name: { en: "Toucan", fa: "توکان" }, category: 'Other', family: 'Toucan' },
];

export const amphibianBreeds: Amphibian[] = [
  { id: 1, name: { en: "African Dwarf Frog", fa: "قورباغه کوتوله آفریقایی" }, category: 'Frog' },
  { id: 2, name: { en: "Amazon Milk Frog", fa: "قورباغه شیر آمازون" }, category: 'Frog' },
  { id: 3, name: { en: "American Green Tree Frog", fa: "قورباغه درختی سبز آمریکایی" }, category: 'Frog' },
  { id: 4, name: { en: "American Bullfrog", fa: "غوک بزرگ آمریکایی" }, category: 'Frog' },
  { id: 5, name: { en: "Argentine Horned Frog", fa: "قورباغه شاخدار آرژانتینی" }, commonNames: ["Pacman Frog", "Ornate Horned Frog"], category: 'Frog' },
  { id: 6, name: { en: "Clown Tree Frog", fa: "قورباغه درختی دلقک" }, category: 'Frog' },
  { id: 7, name: { en: "White's Tree Frog", fa: "قورباغه درختی وایت" }, commonNames: ["Dumpy Tree Frog"], category: 'Frog' },
  { id: 8, name: { en: "Fire-bellied Toad", fa: "وزغ شکم‌آتشی" }, commonNames: ["Oriental Fire-bellied Toad"], category: 'Frog' },
  { id: 9, name: { en: "Gray Tree Frog", fa: "قورباغه درختی خاکستری" }, category: 'Frog' },
  { id: 10, name: { en: "Pixie Frog", fa: "قورباغه پیکسی" }, commonNames: ["African Bullfrog"], category: 'Frog' },
  { id: 11, name: { en: "Poison Dart Frog", fa: "قورباغه زهرآگین" }, category: 'Frog' },
  { id: 12, name: { en: "Red-eyed Tree Frog", fa: "قورباغه درختی چشم‌قرمز" }, category: 'Frog' },
  { id: 13, name: { en: "Tomato Frog", fa: "قورباغه گوجه‌فرنگی" }, category: 'Frog' },
  { id: 14, name: { en: "Axolotl", fa: "اکسولوتل" }, category: 'Salamander' },
  { id: 15, name: { en: "California Newt", fa: "نیوت کالیفرنیا" }, category: 'Salamander' },
  { id: 16, name: { en: "Chinese Fire Belly Newt", fa: "نیوت شکم‌آتشی چینی" }, category: 'Salamander' },
  { id: 17, name: { en: "Eastern Newt", fa: "نیوت شرقی" }, category: 'Salamander' },
  { id: 18, name: { en: "Fire Salamander", fa: "سمندر آتشی" }, category: 'Salamander' },
  { id: 19, name: { en: "Japanese Fire Belly Newt", fa: "نیوت شکم‌آتشی ژاپنی" }, category: 'Salamander' },
  { id: 20, name: { en: "Marbled Salamander", fa: "سمندر مرمری" }, category: 'Salamander' },
  { id: 21, name: { en: "Spotted Salamander", fa: "سمندر خالدار" }, category: 'Salamander' },
  { id: 22, name: { en: "Tiger Salamander", fa: "سمندر ببری" }, category: 'Salamander' },
  { id: 23, name: { en: "Rubber Eel", fa: "مارماهی لاستیکی" }, commonNames: ["Caecilian"], category: 'Caecilian' },
];

export const fishBreeds: Fish[] = [
  { id: 1, name: { en: "Goldfish", fa: "ماهی قرمز" }, category: 'Goldfish & Carp', scientificName: "Carassius auratus" },
  { id: 2, name: { en: "Betta", fa: "بتا (فایتر)" }, commonNames: ["Siamese Fighting Fish"], category: 'Betta', scientificName: "Betta splendens" },
  { id: 3, name: { en: "Guppy", fa: "گوپی" }, category: 'Livebearer', scientificName: "Poecilia reticulata" },
  { id: 4, name: { en: "Angelfish", fa: "آنجل" }, commonNames: ["Freshwater Angelfish"], category: 'Cichlid', scientificName: "Pterophyllum scalare" },
  { id: 5, name: { en: "Neon Tetra", fa: "نئون تترا" }, category: 'Tetra', scientificName: "Paracheirodon innesi" },
  { id: 6, name: { en: "Oscar", fa: "اسکار" }, category: 'Cichlid', scientificName: "Astronotus ocellatus" },
  { id: 7, name: { en: "Molly", fa: "مولی" }, commonNames: ["Common Molly", "Black Molly"], category: 'Livebearer', scientificName: "Poecilia sphenops" },
  { id: 8, name: { en: "Platy", fa: "پلاتی" }, category: 'Livebearer', scientificName: "Xiphophorus maculatus" },
  { id: 9, name: { en: "Swordtail", fa: "شمشیری" }, category: 'Livebearer', scientificName: "Xiphophorus hellerii" },
  { id: 10, name: { en: "Zebra Danio", fa: "زبرا دانیو" }, commonNames: ["Zebrafish"], category: 'Danio', scientificName: "Danio rerio" },
];

export const mammalBreeds: Mammal[] = [
  { id: 1, name: { en: "American Rabbit", fa: "خرگوش آمریکایی" }, category: 'Rabbit', scientificName: "Oryctolagus cuniculus" },
  { id: 2, name: { en: "Angora Rabbit", fa: "خرگوش آنگورا" }, category: 'Rabbit', scientificName: "Oryctolagus cuniculus" },
  { id: 3, name: { en: "Belgian Hare", fa: "خرگوش بلژیکی" }, category: 'Rabbit', scientificName: "Oryctolagus cuniculus" },
  { id: 4, name: { en: "Californian Rabbit", fa: "خرگوش کالیفرنیایی" }, category: 'Rabbit', scientificName: "Oryctolagus cuniculus" },
  { id: 5, name: { en: "Checkered Giant Rabbit", fa: "خرگوش غول‌پیکر شطرنجی" }, category: 'Rabbit', scientificName: "Oryctolagus cuniculus" },
  { id: 6, name: { en: "Chinchilla Rabbit", fa: "خرگوش چینچیلا" }, category: 'Rabbit', scientificName: "Oryctolagus cuniculus" },
  { id: 7, name: { en: "Dutch Rabbit", fa: "خرگوش هلندی" }, category: 'Rabbit', scientificName: "Oryctolagus cuniculus" },
  { id: 8, name: { en: "Dwarf Hotot Rabbit", fa: "خرگوش کوتوله هوتوت" }, category: 'Rabbit', scientificName: "Oryctolagus cuniculus" },
  { id: 9, name: { en: "English Lop", fa: "خرگوش لوپ انگلیسی" }, category: 'Rabbit', scientificName: "Oryctolagus cuniculus" },
  { id: 10, name: { en: "Flemish Giant Rabbit", fa: "خرگوش غول‌پیکر فلمیش" }, category: 'Rabbit', scientificName: "Oryctolagus cuniculus" },
  { id: 11, name: { en: "Florida White Rabbit", fa: "خرگوش سفید فلوریدا" }, category: 'Rabbit', scientificName: "Oryctolagus cuniculus" },
  { id: 12, name: { en: "French Lop", fa: "خرگوش لوپ فرانسوی" }, category: 'Rabbit', scientificName: "Oryctolagus cuniculus" },
  { id: 13, name: { en: "Harlequin Rabbit", fa: "خرگوش هارlequin" }, category: 'Rabbit', scientificName: "Oryctolagus cuniculus" },
  { id: 14, name: { en: "Himalayan Rabbit", fa: "خرگوش هیمالیایی" }, category: 'Rabbit', scientificName: "Oryctolagus cuniculus" },
  { id: 15, name: { en: "Holland Lop", fa: "خرگوش لوپ هلندی" }, category: 'Rabbit', scientificName: "Oryctolagus cuniculus" },
  { id: 16, name: { en: "Jersey Wooly", fa: "جرسی پشمی" }, category: 'Rabbit', scientificName: "Oryctolagus cuniculus" },
  { id: 17, name: { en: "Lionhead Rabbit", fa: "خرگوش سرشیری" }, category: 'Rabbit', scientificName: "Oryctolagus cuniculus" },
  { id: 18, name: { en: "Mini Lop", fa: "خرگوش مینی لوپ" }, category: 'Rabbit', scientificName: "Oryctolagus cuniculus" },
  { id: 19, name: { en: "Mini Rex", fa: "خرگوش مینی رکس" }, category: 'Rabbit', scientificName: "Oryctolagus cuniculus" },
  { id: 20, name: { en: "Netherland Dwarf Rabbit", fa: "خرگوش کوتوله هلندی" }, category: 'Rabbit', scientificName: "Oryctolagus cuniculus" },
  { id: 21, name: { en: "New Zealand Rabbit", fa: "خرگوش نیوزلندی" }, category: 'Rabbit', scientificName: "Oryctolagus cuniculus" },
  { id: 22, name: { en: "Polish Rabbit", fa: "خرگوش لهستانی" }, category: 'Rabbit', scientificName: "Oryctolagus cuniculus" },
  { id: 23, name: { en: "Rex Rabbit", fa: "خرگوش رکس" }, category: 'Rabbit', scientificName: "Oryctolagus cuniculus" },
  { id: 24, name: { en: "Satin Rabbit", fa: "خرگوش ساتن" }, category: 'Rabbit', scientificName: "Oryctolagus cuniculus" },
  { id: 25, name: { en: "Silver Fox Rabbit", fa: "خرگوش روباه نقره‌ای" }, category: 'Rabbit', scientificName: "Oryctolagus cuniculus" },
  { id: 26, name: { en: "Tan Rabbit", fa: "خرگوش قهوه‌ای" }, category: 'Rabbit', scientificName: "Oryctolagus cuniculus" },
  { id: 27, name: { en: "Ferret", fa: "فرت" }, category: 'Ferret', scientificName: "Mustela putorius furo" },
  { id: 28, name: { en: "Hedgehog", fa: "جوجه‌تیغی" }, category: 'Hedgehog', scientificName: "Atelerix albiventris" },
  { id: 29, name: { en: "Sugar Glider", fa: "شوگر گلایدر" }, category: 'Sugar Glider', scientificName: "Petaurus breviceps" },
  { id: 30, name: { en: "Syrian Hamster", fa: "همستر سوری" }, commonNames: ["Golden Hamster", "Teddy Bear Hamster"], category: 'Hamster', scientificName: "Mesocricetus auratus" },
  { id: 31, name: { en: "Campbell's Dwarf Hamster", fa: "همستر کوتوله کمپبل" }, category: 'Hamster', scientificName: "Phodopus campbelli" },
  { id: 32, name: { en: "Winter White Dwarf Hamster", fa: "همستر کوتوله سفید زمستانی" }, commonNames: ["Siberian Hamster"], category: 'Hamster', scientificName: "Phodopus sungorus" },
  { id: 33, name: { en: "Roborovski Dwarf Hamster", fa: "همستر کوتوله روبوروفسکی" }, commonNames: ["Robo Hamster"], category: 'Hamster', scientificName: "Phodopus roborovskii" },
  { id: 34, name: { en: "Chinese Hamster", fa: "همستر چینی" }, category: 'Hamster', scientificName: "Cricetulus griseus" },
  { id: 35, name: { en: "Fancy Rat", fa: "رت خانگی" }, commonNames: ["Domestic Rat"], category: 'Rat', scientificName: "Rattus norvegicus domestica" },
  { id: 36, name: { en: "Dumbo Rat", fa: "رت دامبو" }, category: 'Rat', scientificName: "Rattus norvegicus domestica" },
  { id: 37, name: { en: "Fancy Mouse", fa: "موش خانگی" }, commonNames: ["Domestic Mouse"], category: 'Mouse', scientificName: "Mus musculus" },
  { id: 38, name: { en: "African Spiny Mouse", fa: "موش خاردار آفریقایی" }, category: 'Mouse', scientificName: "Acomys cahirinus" },
  { id: 39, name: { en: "American Guinea Pig", fa: "خوکچه هندی آمریکایی" }, category: 'Guinea Pig', scientificName: "Cavia porcellus" },
  { id: 40, name: { en: "Abyssinian Guinea Pig", fa: "خوکچه هندی حبشی" }, category: 'Guinea Pig', scientificName: "Cavia porcellus" },
  { id: 41, name: { en: "Peruvian Guinea Pig", fa: "خوکچه هندی پرویی" }, category: 'Guinea Pig', scientificName: "Cavia porcellus" },
  { id: 42, name: { en: "Silkie Guinea Pig", fa: "خوکچه هندی ابریشمی" }, commonNames: ["Sheltie Guinea Pig"], category: 'Guinea Pig', scientificName: "Cavia porcellus" },
  { id: 43, name: { en: "Teddy Guinea Pig", fa: "خوکچه هندی تدی" }, category: 'Guinea Pig', scientificName: "Cavia porcellus" },
  { id: 44, name: { en: "Texel Guinea Pig", fa: "خوکچه هندی تکسل" }, category: 'Guinea Pig', scientificName: "Cavia porcellus" },
  { id: 45, name: { en: "Skinny Pig", fa: "خوکچه هندی بی‌مو" }, commonNames: ["Hairless Guinea Pig"], category: 'Guinea Pig', scientificName: "Cavia porcellus" },
  { id: 46, name: { en: "Coronet Guinea Pig", fa: "خوکچه هندی کورونت" }, category: 'Guinea Pig', scientificName: "Cavia porcellus" },
  { id: 47, name: { en: "White Crested Guinea Pig", fa: "خوکچه هندی کاکل‌سفید" }, category: 'Guinea Pig', scientificName: "Cavia porcellus" },
  { id: 48, name: { en: "Chinchilla", fa: "چینچیلا" }, category: 'Chinchilla', scientificName: "Chinchilla lanigera" },
  { id: 49, name: { en: "Mongolian Gerbil", fa: "جربیل مغولی" }, category: 'Gerbil', scientificName: "Meriones unguiculatus" },
  { id: 50, name: { en: "Degu", fa: "دگو" }, category: 'Degu', scientificName: "Octodon degus" },
  { id: 51, name: { en: "Prairie Dog", fa: "سگ دشتی" }, commonNames: ["Black-tailed Prairie Dog"], category: 'Other', scientificName: "Cynomys ludovicianus" },
  { id: 52, name: { en: "Capybara", fa: "کاپیبارا" }, category: 'Other', scientificName: "Hydrochoerus hydrochaeris" },
];

export const reptileBreeds: Reptile[] = [
  { id: 1, name: { en: "Bearded Dragon", fa: "اژدهای ریش‌دار" }, category: 'Lizard', scientificName: "Pogona vitticeps" },
  { id: 2, name: { en: "Leopard Gecko", fa: "گکوی پلنگی" }, category: 'Lizard', scientificName: "Eublepharis macularius" },
  { id: 3, name: { en: "Crested Gecko", fa: "گکوی کاکل‌دار" }, category: 'Lizard', scientificName: "Correlophus ciliatus" },
  { id: 4, name: { en: "Green Iguana", fa: "ایگوانای سبز" }, category: 'Lizard', scientificName: "Iguana iguana" },
  { id: 5, name: { en: "Blue-Tongued Skink", fa: "اسکینک زبان‌آبی" }, category: 'Lizard', scientificName: "Tiliqua scincoides" },
  { id: 6, name: { en: "Chameleon", fa: "آفتاب‌پرست" }, commonNames: ["Veiled Chameleon", "Panther Chameleon"], category: 'Lizard', scientificName: "Chamaeleonidae" },
  { id: 7, name: { en: "Anole", fa: "آنول" }, commonNames: ["Green Anole"], category: 'Lizard', scientificName: "Anolis carolinensis" },
  { id: 8, name: { en: "Uromastyx", fa: "خاردم" }, commonNames: ["Spiny-tailed lizard"], category: 'Lizard', scientificName: "Uromastyx" },
  { id: 9, name: { en: "Ball Python", fa: "پایتون توپی" }, category: 'Snake', scientificName: "Python regius" },
  { id: 10, name: { en: "Corn Snake", fa: "مار ذرت" }, category: 'Snake', scientificName: "Pantherophis guttatus" },
  { id: 11, name: { en: "King Snake", fa: "کینگ اسنیک" }, commonNames: ["California Kingsnake"], category: 'Snake', scientificName: "Lampropeltis californiae" },
  { id: 12, name: { en: "Boa Constrictor", fa: "بوآی کانستریکتور" }, category: 'Snake', scientificName: "Boa constrictor" },
  { id: 13, name: { en: "Garter Snake", fa: "مار گارتر" }, category: 'Snake', scientificName: "Thamnophis sirtalis" },
  { id: 14, name: { en: "Red-Eared Slider", fa: "لاک‌پشت گوش‌قرمز" }, category: 'Turtle & Tortoise', scientificName: "Trachemys scripta elegans" },
  { id: 15, name: { en: "Russian Tortoise", fa: "لاک‌پشت روسی" }, category: 'Turtle & Tortoise', scientificName: "Agrionemys horsfieldii" },
  { id: 16, name: { en: "Greek Tortoise", fa: "لاک‌پشت یونانی" }, commonNames: ["Spur-thighed tortoise"], category: 'Turtle & Tortoise', scientificName: "Testudo graeca" },
  { id: 17, name: { en: "Box Turtle", fa: "لاک‌پشت جعبه‌ای" }, commonNames: ["Eastern Box Turtle"], category: 'Turtle & Tortoise', scientificName: "Terrapene carolina carolina" },
  { id: 18, name: { en: "Hermann's Tortoise", fa: "لاک‌پشت هرمان" }, category: 'Turtle & Tortoise', scientificName: "Testudo hermanni" },
];

export const horseBreeds: Horse[] = [
  { id: 1, name: { en: "Arabian", fa: "عرب" }, origin: "Middle East" },
  { id: 2, name: { en: "Turkoman", fa: "ترکمن" }, origin: "Turkmenistan/Iran" },
  { id: 3, name: { en: "Caspian", fa: "کاسپین" }, origin: "Iran" },
  { id: 4, name: { en: "Kurd", fa: "کرد" }, origin: "Iran" },
  { id: 5, name: { en: "Dareh Shoori", fa: "دره‌شوری" }, origin: "Iran" },
  { id: 6, name: { en: "Thoroughbred", fa: "تروبرد" }, origin: "United Kingdom" },
  { id: 7, name: { en: "Quarter Horse", fa: "کوارتر" }, origin: "USA" },
  { id: 8, name: { en: "Paint Horse", fa: "پینت" }, origin: "USA" },
  { id: 9, name: { en: "Appaloosa", fa: "آپالوسا" }, origin: "USA" },
  { id: 10, name: { en: "Friesian", fa: "فریزین" }, origin: "Netherlands" },
  { id: 11, name: { en: "Andalusian", fa: "اندلسی" }, origin: "Spain" },
  { id: 12, name: { en: "Clydesdale", fa: "کلایدسدال" }, origin: "Scotland" },
  { id: 13, name: { en: "Shire", fa: "شایر" }, origin: "England" },
  { id: 14, name: { en: "Shetland Pony", fa: "پونی شتلند" }, origin: "Scotland" },
  { id: 15, name: { en: "Miniature Horse", fa: "اسب مینیاتوری" }, origin: "Europe/Americas" },
  { id: 16, name: { en: "Mustang", fa: "ماستنگ" }, origin: "USA" },
  { id: 17, name: { en: "Percheron", fa: "پرشرون" }, origin: "France" },
  { id: 18, name: { en: "Hanoverian", fa: "هانوفرین" }, origin: "Germany" },
  { id: 19, name: { en: "Oldenburg", fa: "اولدنبورگ" }, origin: "Germany" },
  { id: 20, name: { en: "Haflinger", fa: "هافلینگر" }, origin: "Austria" },
];

export const cowBreeds: Cow[] = [
  { id: 1, name: { en: "Holstein", fa: "هلشتاین" }, purpose: "Dairy" },
  { id: 2, name: { en: "Jersey", fa: "جرزی" }, purpose: "Dairy" },
  { id: 3, name: { en: "Brown Swiss", fa: "براون سوئیس" }, purpose: "Dairy/Dual" },
  { id: 4, name: { en: "Simmental", fa: "سیمنتال" }, purpose: "Dual" },
  { id: 5, name: { en: "Angus", fa: "آنگوس" }, purpose: "Beef" },
  { id: 6, name: { en: "Hereford", fa: "هرفورد" }, purpose: "Beef" },
  { id: 7, name: { en: "Charolais", fa: "شاروله" }, purpose: "Beef" },
  { id: 8, name: { en: "Limousin", fa: "لیموزین" }, purpose: "Beef" },
  { id: 9, name: { en: "Brahman", fa: "برهمن" }, purpose: "Beef" },
  { id: 10, name: { en: "Belgian Blue", fa: "بلژین بلو" }, purpose: "Beef" },
  { id: 11, name: { en: "Wagyu", fa: "واگیو" }, purpose: "Beef" },
  { id: 12, name: { en: "Sarabi", fa: "سرابی" }, purpose: "Dual" },
  { id: 13, name: { en: "Sistani", fa: "سیستانی" }, purpose: "Beef" },
  { id: 14, name: { en: "Golpayegani", fa: "گلپایگانی" }, purpose: "Dairy" },
  { id: 15, name: { en: "Najdi", fa: "نجدی" }, purpose: "Dairy" },
];

export const smallRuminantBreeds: SmallRuminant[] = [
  // Sheep
  { id: 1, name: { en: "Afshari", fa: "گوسفند افشاری" }, speciesType: "Sheep" },
  { id: 2, name: { en: "Ghezel", fa: "گوسفند قزل" }, speciesType: "Sheep" },
  { id: 3, name: { en: "Moghani", fa: "گوسفند مغانی" }, speciesType: "Sheep" },
  { id: 4, name: { en: "Baluchi", fa: "گوسفند بلوچی" }, speciesType: "Sheep" },
  { id: 5, name: { en: "Shal", fa: "گوسفند شال" }, speciesType: "Sheep" },
  { id: 6, name: { en: "Sangsari", fa: "گوسفند سنگسری" }, speciesType: "Sheep" },
  { id: 7, name: { en: "Lori-Bakhtiari", fa: "گوسفند لری بختیاری" }, speciesType: "Sheep" },
  { id: 8, name: { en: "Romanov", fa: "رومانوف" }, speciesType: "Sheep" },
  { id: 9, name: { en: "Suffolk", fa: "سافولک" }, speciesType: "Sheep" },
  { id: 10, name: { en: "Merino", fa: "مرینو" }, speciesType: "Sheep" },
  { id: 11, name: { en: "Dorper", fa: "دورپر" }, speciesType: "Sheep" },
  // Goats
  { id: 12, name: { en: "Saanen", fa: "بز سانن" }, speciesType: "Goat" },
  { id: 13, name: { en: "Alpine", fa: "بز آلپاین" }, speciesType: "Goat" },
  { id: 14, name: { en: "Boer", fa: "بز بوئر" }, speciesType: "Goat" },
  { id: 15, name: { en: "Murciana", fa: "بز مورسیانا" }, speciesType: "Goat" },
  { id: 16, name: { en: "Mahabadi", fa: "بز مهابادی" }, speciesType: "Goat" },
  { id: 17, name: { en: "Raiyni", fa: "بز راینی" }, speciesType: "Goat" },
  { id: 18, name: { en: "Adani", fa: "بز عدنی" }, speciesType: "Goat" },
  { id: 19, name: { en: "Najdi", fa: "بز نجدی" }, speciesType: "Goat" },
  { id: 20, name: { en: "Pygmy", fa: "بز پیگمی" }, speciesType: "Goat" },
];