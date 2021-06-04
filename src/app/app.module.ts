import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { StoreModule } from '@ngrx/store'
import { storageSyncMetaReducer } from 'ngrx-store-persist'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { reducer as CourseReducer } from './state/admin/courses/course.reducers'
import { reducer as SectionReducer } from './state/admin/sections/section.reducers'
import { reducer as LectureReducer } from './state/admin/lectures/lecture.reducers'
import { CarouselModule } from 'ngx-owl-carousel-o'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { CountUpModule } from 'ngx-countup'
import { TabsModule } from 'ngx-tabset'
import { NgxScrollTopModule } from 'ngx-scrolltop'
import { LightboxModule } from 'ngx-lightbox'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HomePageOneComponent } from './components/pages/home-page-one/home-page-one.component'
import { HomePageTwoComponent } from './components/pages/home-page-two/home-page-two.component'
import { FooterComponent } from './components/common/footer/footer.component'
import { PreloaderComponent } from './components/common/preloader/preloader.component'
import { HomeoneAboutComponent } from './components/pages/home-page-one/homeone-about/homeone-about.component'
import { HomeoneMainBannerComponent } from './components/pages/home-page-one/homeone-main-banner/homeone-main-banner.component'
import { CategoriesStyleOneComponent } from './components/common/categories-style-one/categories-style-one.component'
import { FunfactsComponent } from './components/common/funfacts/funfacts.component'
import { HomeoneCoursesComponent } from './components/pages/home-page-one/homeone-courses/homeone-courses.component'
import { PartnerStyleOneComponent } from './components/common/partner-style-one/partner-style-one.component'
import { InstructorsStyleOneComponent } from './components/common/instructors-style-one/instructors-style-one.component'
import { BecomeInstructorPartnerComponent } from './components/common/become-instructor-partner/become-instructor-partner.component'
import { FeedbackStyleOneComponent } from './components/common/feedback-style-one/feedback-style-one.component'
import { BlogComponent } from './components/common/blog/blog.component'
import { HometwoMainBannerComponent } from './components/pages/home-page-two/hometwo-main-banner/hometwo-main-banner.component'
import { HometwoAboutComponent } from './components/pages/home-page-two/hometwo-about/hometwo-about.component'
import { HometwoCoursesComponent } from './components/pages/home-page-two/hometwo-courses/hometwo-courses.component'
import { OurMissionComponent } from './components/common/our-mission/our-mission.component'
import { InstructorsStyleTwoComponent } from './components/common/instructors-style-two/instructors-style-two.component'
import { WebinarCountdownComponent } from './components/common/webinar-countdown/webinar-countdown.component'
import { StudentsFeedbackFormComponent } from './components/common/students-feedback-form/students-feedback-form.component'
import { HomePageThreeComponent } from './components/pages/home-page-three/home-page-three.component'
import { HomePageFourComponent } from './components/pages/home-page-four/home-page-four.component'
import { HomePageFiveComponent } from './components/pages/home-page-five/home-page-five.component'
import { HomePageSixComponent } from './components/pages/home-page-six/home-page-six.component'
import { HomePageSevenComponent } from './components/pages/home-page-seven/home-page-seven.component'
import { PartnerStyleTwoComponent } from './components/common/partner-style-two/partner-style-two.component'
import { OfferComponent } from './components/common/offer/offer.component'
import { CategoriesStyleTwoComponent } from './components/common/categories-style-two/categories-style-two.component'
import { HomethreeCoursesComponent } from './components/pages/home-page-three/homethree-courses/homethree-courses.component'
import { HomethreeAboutComponent } from './components/pages/home-page-three/homethree-about/homethree-about.component'
import { FeedbackFormComponent } from './components/common/feedback-form/feedback-form.component'
import { HomethreeMainBannerComponent } from './components/pages/home-page-three/homethree-main-banner/homethree-main-banner.component'
import { HomefourMainBannerComponent } from './components/pages/home-page-four/homefour-main-banner/homefour-main-banner.component'
import { HomefourCoursesComponent } from './components/pages/home-page-four/homefour-courses/homefour-courses.component'
import { BoxesComponent } from './components/common/boxes/boxes.component'
import { FeedbackStyleTwoComponent } from './components/common/feedback-style-two/feedback-style-two.component'
import { HomefiveCoursesComponent } from './components/pages/home-page-five/homefive-courses/homefive-courses.component'
import { HomefiveMainBannerComponent } from './components/pages/home-page-five/homefive-main-banner/homefive-main-banner.component'
import { InstructorsStyleThreeComponent } from './components/common/instructors-style-three/instructors-style-three.component'
import { FeaturesComponent } from './components/common/features/features.component'
import { HomesixCoursesComponent } from './components/pages/home-page-six/homesix-courses/homesix-courses.component'
import { CategoriesStyleThreeComponent } from './components/common/categories-style-three/categories-style-three.component'
import { HomesixMainBannerComponent } from './components/pages/home-page-six/homesix-main-banner/homesix-main-banner.component'
import { HomesevenMainBannerComponent } from './components/pages/home-page-seven/homeseven-main-banner/homeseven-main-banner.component'
import { HomesevenCoursesComponent } from './components/pages/home-page-seven/homeseven-courses/homeseven-courses.component'
import { HowItWorksComponent } from './components/common/how-it-works/how-it-works.component'
import { AboutPageOneComponent } from './components/pages/about-page-one/about-page-one.component'
import { AboutPageTwoComponent } from './components/pages/about-page-two/about-page-two.component'
import { OurStoryComponent } from './components/common/our-story/our-story.component'
import { OurValuesComponent } from './components/common/our-values/our-values.component'
import { InstructorsPageOneComponent } from './components/pages/instructors-page-one/instructors-page-one.component'
import { InstructorsPageTwoComponent } from './components/pages/instructors-page-two/instructors-page-two.component'
import { InstructorsPageThreeComponent } from './components/pages/instructors-page-three/instructors-page-three.component'
import { InstructorsDetailsPageComponent } from './components/pages/instructors-details-page/instructors-details-page.component'
import { GalleryPageComponent } from './components/pages/gallery-page/gallery-page.component'
import { EventsPageComponent } from './components/pages/events-page/events-page.component'
import { EventsDetailsPageComponent } from './components/pages/events-details-page/events-details-page.component'
import { PricingPageComponent } from './components/pages/pricing-page/pricing-page.component'
import { FeedbackPageComponent } from './components/pages/feedback-page/feedback-page.component'
import { PartnerPageComponent } from './components/pages/partner-page/partner-page.component'
import { LoginPageComponent } from './components/pages/login-page/login-page.component'
import { RegisterPageComponent } from './components/pages/register-page/register-page.component'
import { FaqPageComponent } from './components/pages/faq-page/faq-page.component'
import { ErrorPageComponent } from './components/pages/error-page/error-page.component'
import { ComingSoonPageComponent } from './components/pages/coming-soon-page/coming-soon-page.component'
import { BlogGridPageComponent } from './components/pages/blog-grid-page/blog-grid-page.component'
import { BlogRightSidebarPageComponent } from './components/pages/blog-right-sidebar-page/blog-right-sidebar-page.component'
import { BlogFullWidthPageComponent } from './components/pages/blog-full-width-page/blog-full-width-page.component'
import { BlogDetailsPageComponent } from './components/pages/blog-details-page/blog-details-page.component'
import { ShopGridPageComponent } from './components/pages/shop-grid-page/shop-grid-page.component'
import { ShopFullWidthPageComponent } from './components/pages/shop-full-width-page/shop-full-width-page.component'
import { ProductsDetailsPageComponent } from './components/pages/products-details-page/products-details-page.component'
import { CartPageComponent } from './components/pages/cart-page/cart-page.component'
import { CheckoutPageComponent } from './components/pages/checkout-page/checkout-page.component'
import { ContactPageComponent } from './components/pages/contact-page/contact-page.component'
import { CategoryPageOneComponent } from './components/pages/category-page-one/category-page-one.component'
import { CategoryPageTwoComponent } from './components/pages/category-page-two/category-page-two.component'
import { CategoryPageThreeComponent } from './components/pages/category-page-three/category-page-three.component'
import { CoursesListPageComponent } from './components/pages/courses-list-page/courses-list-page.component'
import { CoursesGridStyleOneColumnsTwoPageComponent } from './components/pages/courses-grid-style-one-columns-two-page/courses-grid-style-one-columns-two-page.component'
import { CoursesGridStyleOneColumnsThreePageComponent } from './components/pages/courses-grid-style-one-columns-three-page/courses-grid-style-one-columns-three-page.component'
import { CoursesGridStyleOneColumnsFourPageComponent } from './components/pages/courses-grid-style-one-columns-four-page/courses-grid-style-one-columns-four-page.component'
import { CoursesGridStyleTwoColumnsTwoPageComponent } from './components/pages/courses-grid-style-two-columns-two-page/courses-grid-style-two-columns-two-page.component'
import { CoursesGridStyleTwoColumnsThreePageComponent } from './components/pages/courses-grid-style-two-columns-three-page/courses-grid-style-two-columns-three-page.component'
import { CoursesGridStyleTwoColumnsFourPageComponent } from './components/pages/courses-grid-style-two-columns-four-page/courses-grid-style-two-columns-four-page.component'
import { CoursesGridStyleThreeColumnsTwoPageComponent } from './components/pages/courses-grid-style-three-columns-two-page/courses-grid-style-three-columns-two-page.component'
import { CoursesGridStyleThreeColumnsThreePageComponent } from './components/pages/courses-grid-style-three-columns-three-page/courses-grid-style-three-columns-three-page.component'
import { CoursesGridStyleThreeColumnsFourPageComponent } from './components/pages/courses-grid-style-three-columns-four-page/courses-grid-style-three-columns-four-page.component'
import { CoursesDetailsPageComponent } from './components/pages/courses-details-page/courses-details-page.component'
import { MyDashboardPageComponent } from './components/pages/my-dashboard-page/my-dashboard-page.component'
import { OrdersPageComponent } from './components/pages/orders-page/orders-page.component'
import { DownloadsPageComponent } from './components/pages/downloads-page/downloads-page.component'
import { EditAddressPageComponent } from './components/pages/edit-address-page/edit-address-page.component'
import { EditAccountPageComponent } from './components/pages/edit-account-page/edit-account-page.component'
import { EditBillingAddressPageComponent } from './components/pages/edit-billing-address-page/edit-billing-address-page.component'
import { EditShippingAddressPageComponent } from './components/pages/edit-shipping-address-page/edit-shipping-address-page.component'
import { AdminModule } from './components/pages/admin/admin.module'
import { SharedModule } from './shared.module'

const store = {
  courses: CourseReducer,
  sections: SectionReducer,
  lectures: LectureReducer
}
@NgModule({
  declarations: [
    AppComponent,
    HomePageOneComponent,
    HomePageTwoComponent,
    FooterComponent,
    PreloaderComponent,
    HomeoneAboutComponent,
    HomeoneMainBannerComponent,
    CategoriesStyleOneComponent,
    FunfactsComponent,
    HomeoneCoursesComponent,
    PartnerStyleOneComponent,
    InstructorsStyleOneComponent,
    BecomeInstructorPartnerComponent,
    FeedbackStyleOneComponent,
    BlogComponent,
    HometwoMainBannerComponent,
    HometwoAboutComponent,
    HometwoCoursesComponent,
    OurMissionComponent,
    InstructorsStyleTwoComponent,
    WebinarCountdownComponent,
    StudentsFeedbackFormComponent,
    HomePageThreeComponent,
    HomePageFourComponent,
    HomePageFiveComponent,
    HomePageSixComponent,
    HomePageSevenComponent,
    PartnerStyleTwoComponent,
    OfferComponent,
    CategoriesStyleTwoComponent,
    HomethreeCoursesComponent,
    HomethreeAboutComponent,
    FeedbackFormComponent,
    HomethreeMainBannerComponent,
    HomefourMainBannerComponent,
    HomefourCoursesComponent,
    BoxesComponent,
    FeedbackStyleTwoComponent,
    HomefiveCoursesComponent,
    HomefiveMainBannerComponent,
    InstructorsStyleThreeComponent,
    FeaturesComponent,
    HomesixCoursesComponent,
    CategoriesStyleThreeComponent,
    HomesixMainBannerComponent,
    HomesevenMainBannerComponent,
    HomesevenCoursesComponent,
    HowItWorksComponent,
    AboutPageOneComponent,
    AboutPageTwoComponent,
    OurStoryComponent,
    OurValuesComponent,
    InstructorsPageOneComponent,
    InstructorsPageTwoComponent,
    InstructorsPageThreeComponent,
    InstructorsDetailsPageComponent,
    GalleryPageComponent,
    EventsPageComponent,
    EventsDetailsPageComponent,
    PricingPageComponent,
    FeedbackPageComponent,
    PartnerPageComponent,
    LoginPageComponent,
    RegisterPageComponent,
    FaqPageComponent,
    ErrorPageComponent,
    ComingSoonPageComponent,
    BlogGridPageComponent,
    BlogRightSidebarPageComponent,
    BlogFullWidthPageComponent,
    BlogDetailsPageComponent,
    ShopGridPageComponent,
    ShopFullWidthPageComponent,
    ProductsDetailsPageComponent,
    CartPageComponent,
    CheckoutPageComponent,
    ContactPageComponent,
    CategoryPageOneComponent,
    CategoryPageTwoComponent,
    CategoryPageThreeComponent,
    CoursesListPageComponent,
    CoursesGridStyleOneColumnsTwoPageComponent,
    CoursesGridStyleOneColumnsThreePageComponent,
    CoursesGridStyleOneColumnsFourPageComponent,
    CoursesGridStyleTwoColumnsTwoPageComponent,
    CoursesGridStyleTwoColumnsThreePageComponent,
    CoursesGridStyleTwoColumnsFourPageComponent,
    CoursesGridStyleThreeColumnsTwoPageComponent,
    CoursesGridStyleThreeColumnsThreePageComponent,
    CoursesGridStyleThreeColumnsFourPageComponent,
    CoursesDetailsPageComponent,
    MyDashboardPageComponent,
    OrdersPageComponent,
    DownloadsPageComponent,
    EditAddressPageComponent,
    EditAccountPageComponent,
    EditBillingAddressPageComponent,
    EditShippingAddressPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CarouselModule,
    CountUpModule,
    TabsModule,
    NgxScrollTopModule,
    LightboxModule,
    FormsModule,
    HttpClientModule,
    AdminModule,
    SharedModule,
    StoreModule.forRoot(store, { metaReducers: [storageSyncMetaReducer] }),
    StoreDevtoolsModule.instrument({
      maxAge: 25
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
