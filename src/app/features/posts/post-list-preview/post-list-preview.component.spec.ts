import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostListPreviewComponent } from './post-list-preview.component';

describe('PostListPreviewComponent', () => {
  let component: PostListPreviewComponent;
  let fixture: ComponentFixture<PostListPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostListPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostListPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
