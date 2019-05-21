export interface UserPic { 
    Username: string;
    CanEdit: boolean;
    ShowPicture: boolean;
    ShowPassport: boolean;
    PicURL: string | any;
    BaseURL: string;
    PicDesc: string;
    Category: string;
    IsTravel: boolean;
    FD: FormData;
    FileName: string;
    ImageType: string;
}

export interface TravelDoc { 
    Username: string;
    Image: string | any;
    ImageType: string;
    Category: string;
    Description: string;
}
