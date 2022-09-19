import {
  trigger,
  style,
  animate,
  transition,
  query,
  group,
  state
} from '@angular/animations'
export class RouterAnimations {
  static routerForwardAnimation() {
    return trigger('routeAnimations', [
      transition('* <=> *', [
        query(
          ':enter, :leave',
          style({ position: 'absolute', width: '100%' }),
          {
            optional: true
          }
        ),
        group([
          query(
            ':enter',
            [
              style({ transform: 'translateX(100%)' }),
              animate(
                '0.5s ease-in-out',
                style({ transform: 'translateX(0%)' })
              )
            ],
            { optional: true }
          ),
          query(
            ':leave',
            [
              style({ transform: 'translateX(0%)' }),
              animate(
                '0.5s ease-in-out',
                style({ transform: 'translateX(-100%)' })
              )
            ],
            { optional: true }
          )
        ])
      ])
    ])
  }

  static viewCourseTransition() {
    return trigger('fadeInOut', [
      transition('* <=> *', [
        style({ position: 'relative' }),
        query(
          ':enter, :leave',
          style({ position: 'absolute', top: 0, width: '100%' }),
          {
            optional: true
          }
        ),
        group([
          query(
            ':enter',
            [
              style({ transform: 'translateX(100%)', opacity: 0 }),
              animate(
                '0.5s ease-in-out',
                style({ transform: 'translateX(0%)', opacity: 1 })
              )
            ],
            { optional: true }
          ),
          query(
            ':leave',
            [
              style({ transform: 'translateX(0%)', opacity: 1 }),
              animate(
                '0.5s ease-in-out',
                style({ transform: 'translateX(-100%)', opacity: 0 })
              )
            ],
            { optional: true }
          )
        ])
      ])
    ])
  }

  static tabTransition() {
    return trigger('fadeInOutTab', [
      state(
        'stack-tab',
        style({
          position: 'static',
          opacity: 1,
          width: 'calc(100% - 20px)'
        })
      ),
      state(
        'in-tab',
        style({
          position: 'absolute',
          top: 0,
          transform: 'none',
          width: 'calc(100% - 20px)', //Toma encuenta padding para mostrar sombreado
          opacity: 1
        })
      ),
      state(
        'out-tab',
        style({
          position: 'absolute',
          top: 0,
          transform: 'translateX(100%)',
          opacity: 0
        })
      ),
      transition('stack-tab => out-tab', [
        style({
          position: 'absolute',
          top: 0,
          transform: 'none'
        }),
        animate('0.5s ease-in-out')
      ]),
      transition('in-tab => out-tab', [animate('0.5s ease-in-out')]),
      transition('out-tab => in-tab', [animate('0.5s ease-in-out')])
    ])
  }

  static fadeTransition() {
    return trigger('listFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s 0.1s ease', style({ opacity: 1 }))
      ]),
      transition(':leave', [animate('0.3s 0.1s ease', style({ opacity: 0 }))])
    ])
  }
}
